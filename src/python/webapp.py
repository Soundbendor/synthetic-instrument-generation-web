from flask import Flask, Response, request
from datetime import datetime
import pymysql, os, numpy, ga, re, random
import ga_query_functions as query

curr_pop = []
random_pop = 0
voting_threshold = 0

db = pymysql.connect(host = 'sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com',
            user = 'admin',
            password = 'Beaver!1',
            database = 'sig')

cursor = db.cursor()

sql = "SELECT * FROM `populations` ORDER BY RAND() LIMIT 1;"
cursor.execute(sql)
result = cursor.fetchone()
random_pop = str(result[0])
print(random_pop)

sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
cursor.execute(sql, random_pop)
chromosomes = cursor.fetchall()

for chromosome in chromosomes:
    curr_pop.append(int(re.sub('\D', '', str(chromosome))))
print(curr_pop)

cursor.close()


api = Flask(__name__)

# Either do a random query on 2 sounds, or gain this from the GA
@api.route('/retrieve_member')
def retrieve_member():
    db = pymysql.connect(host = 'sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com',
                user = 'admin',
                password = 'Beaver!1',
                database = 'sig')

    cursor = db.cursor()
    
    sql = "SELECT * FROM `populations` ORDER BY RAND() LIMIT 1;"
    cursor.execute(sql)
    result = cursor.fetchone()
    random_pop = str(result[0])
    
    sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s ORDER BY RAND() LIMIT 1;"
    cursor.execute(sql, (random_pop))
    result = cursor.fetchone()
    random_chromosome = str(result[0])
    
    chromosomeID = random.choice(curr_pop)

    # Finds a member given their chromosome ID then returns the harmonics, amplitudes and adsr values of that member
    #chromosomeID = request.args.get('chromosomeID')
    # Gets the geneID with the corresponding chromosomeID
    sql = "SELECT `geneID` FROM `genes` WHERE `chromosomeID` = %s"
    cursor.execute(sql, (chromosomeID))
    result = cursor.fetchone()
    geneID = str(result[0])

    # The input in sql query needs to be a string, not an int
    sql = "SELECT `value` FROM `harmonics` WHERE `geneID` =%s"
    cursor.execute(sql, (geneID))

    harms = []

    # To make this more modular, the 10 could be changed to gene_length when integrated into the GA file
    for i in range(10):
        result = cursor.fetchone()
        result = float(result[0])
        harms.append(result)

    sql = "SELECT `value` FROM `amplitudes`WHERE `geneID`=%s"
    cursor.execute(sql, (geneID))

    amps = []

    for i in range(10):
        result = cursor.fetchone()
        result = float(result[0])
        amps.append(result)

    sql = "SELECT `value` FROM `attacks`WHERE `geneID`=%s"
    cursor.execute(sql, (geneID))

    a = []

    for i in range(10):
        result = cursor.fetchone()
        result = float(result[0])
        a.append(result)

    sql = "SELECT `value` FROM `decays`WHERE `geneID`=%s"
    cursor.execute(sql, (geneID))

    d = []

    for i in range(10):
        result = cursor.fetchone()
        result = float(result[0])
        d.append(result)

    sql = "SELECT `value` FROM `sustains`WHERE `geneID`=%s"
    cursor.execute(sql, (geneID))

    s = []

    for i in range(10):
        result = cursor.fetchone()
        result = float(result[0])
        s.append(result)

    sql = "SELECT `value` FROM `releases`WHERE `geneID`=%s"
    cursor.execute(sql, (geneID))

    r = []

    for i in range(10):
        result = cursor.fetchone()
        result = float(result[0])
        r.append(result)
    
    # Also should return populationID, chromosomeID, geneID, parent1 and parent2
    # Retrieves populationID from corresponding chromosome
    sql = "SELECT `populationID` FROM `chromosomes` WHERE `chromosomeID` = %s" 
    cursor.execute(sql, (chromosomeID))
    result = cursor.fetchone()
    populationID = str(result[0])

    # Retrieves first parent from corresponding chromosome
    sql = "SELECT `parent1` FROM `chromosomes` WHERE `chromosomeID` = %s" 
    cursor.execute(sql, (chromosomeID))
    result = cursor.fetchone()
    parent1 = str(result[0])

    # Retrieves second parent from corresponding chromosome
    sql = "SELECT `parent2` FROM `chromosomes` WHERE `chromosomeID` = %s" 
    cursor.execute(sql, (chromosomeID))
    result = cursor.fetchone()
    parent2 = str(result[0])

    instrument = {
        "harms": harms,
        "amps": amps,
        "attacks": a,
        "decays": d,
        "sustains": s,
        "releases": r,
        "populationID": populationID,
        "chromosomeID": chromosomeID,
        "geneID": geneID,
        "parent1": parent1,
        "parent2": parent2
    }
    
    cursor.close()
    
    return instrument


@api.route('/vote')
def vote():
    global voting_threshold, random_pop
    gen_number = 0
    voting_threshold += 1
    
    db = pymysql.connect(host = 'sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com',
            user = 'admin',
            password = 'Beaver!1',
            database = 'sig')

    cursor = db.cursor()
    
    chromosomeID = request.args.get('chromosomeID')
    ip = request.args.get('ip')
    location = request.args.get('location')
    votes = request.args.get('currVotes')
    
    print("------------------\nVotes: \n", voting_threshold, "\n--------------")
    
    sql = """INSERT INTO `votes` 
            (winnerID, location, timestamp, IP)
            VALUES (%s, %s, %s, %s)"""
        
    cursor.execute(sql, (chromosomeID, location, datetime.now(), ip))

    
    # Given curr_pop = [2, 48, 49, 50, 51, 52, 53, 54, 55]
    if voting_threshold > 3:
        # Create empty array to hold members
        curr_pop_mems = []
        
        # Grab all members and add to array
        for chromosome in curr_pop:
            curr_pop_mems.append(query.retrieve_member(chromosome))
            
        # Create new pop
        new_pop = ga.single_island(curr_pop_mems)
        
        # Get new gen_number
        sql = "SELECT `generation_number` FROM `populations` WHERE populationID = %s"
        cursor.execute(sql, random_pop)
        new_gen_number = cursor.fetchone()
        
        # Get new pop id
        new_popID = query.add_population(new_gen_number)
        
        # Add all members individually to DB
        for chromosome in new_pop:
            query.add_member(chromosome, new_popID)
        voting_theshold = 0
        
    db.commit()
    cursor.close()
    
    return "Success"
    

if __name__ == '__main__':
    api.run(host='127.0.0.1', port=5000, debug=True)
    