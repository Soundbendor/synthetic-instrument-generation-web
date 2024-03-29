from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv

import pymysql, os, numpy, re, random

import ga
import ga_query_functions as query

load_dotenv()
db_host = os.environ.get('MYSQL_HOST')
db_user = os.environ.get('MYSQL_USER')
db_pass = os.environ.get('MYSQL_PASS')
db_name = os.environ.get('MYSQL_DB')

# Global variables
curr_gen_number = 0
random_pop = 0
voting_threshold = 0


api = Flask(__name__)
CORS(api)


############################
# Retrieve a single member #
############################
@api.route('/retrieve_member', methods=['GET'])
def retrieve_member():
    db = pymysql.connect(host = db_host,
                        user = db_user,
                        password = db_pass,
                        database = db_name)
    cursor = db.cursor()
    
    chromosomeID = random.choice(curr_pop)

    # Finds a member given their chromosome ID then returns the harmonics, amplitudes and adsr values of that member
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
    db.close()
    
    response = jsonify(instrument)
    
    return response


###################
# Vote for member #
###################
@api.route('/vote', methods=['POST'])
def vote():
    global voting_threshold, random_pop, curr_gen_number, curr_pop
    gen_number = 0
    voting_threshold += 1
    
    db = pymysql.connect(host = db_host,
                        user = db_user,
                        password = db_pass,
                        database = db_name)
    
    cursor = db.cursor()
    
    chromosomeID = request.args.get('chromosomeID')
    opponentChromosomeID = request.args.get('opponentID')
    ip = request.args.get('ip')
    location = request.args.get('location')

    # Display vote info
    print("Voted for:", chromosomeID)
    print("Oponnent Chromosome ID:", opponentChromosomeID)
    print("IP:", ip)
    print("Location:", location)
    print("Generation:", curr_gen_number, "Votes:", voting_threshold)
    

    sql = """INSERT INTO `votes` 
            (winnerID, opponentID, location, timestamp, IP)
            VALUES (%s, %s, %s, %s, %s)"""
        
    cursor.execute(sql, (chromosomeID, opponentChromosomeID, location, datetime.now(), ip))
    
    if voting_threshold > 3:
        # Create empty array to hold members
        curr_pop_mems = []
        
        # Grab all members and add to array
        for chromosome in curr_pop:
            curr_pop_mems.append(query.retrieve_member(chromosome))
            
        # Create new pop
        new_pop = ga.single_island(curr_pop_mems)
        for item in new_pop:
            print(item.get_gen_number())
            
        # Get new gen_number
        new_gen_number = new_pop[0].get_gen_number()
        # Make new gen number to be curr gen number
        curr_gen_number = new_gen_number
        
        print("\n\n\n\nCurr gen num", new_gen_number, "\n\n\n\n")
        
        # Get new pop id
        new_popID = query.add_population(curr_gen_number)
        
        # Add all members individually to DB
        for chromosome in new_pop:
            query.add_member(chromosome, new_popID)
            
        # Update curr_pop    
        sql = "SELECT `populationID` FROM `populations` WHERE `generation_number` = %s"
        cursor.execute(sql, curr_gen_number)
        result = cursor.fetchone()
        curr_popID = int(re.sub('\D', '', str(result)))

        sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
        cursor.execute(sql, curr_popID)
        chromosomes = cursor.fetchall()
        
        curr_pop = []
        
        for chromosome in chromosomes:
            curr_pop.append(int(re.sub('\D', '', str(chromosome))))
            
        # Reset voting_threshold
        voting_threshold = 0
        
    db.commit()
    cursor.close()
    db.close()
    
    response = jsonify({'message': 'Vote successfully processed'})
    
    return response

###################################
# Admin control, skip to next gen #
###################################
@api.route('/next_gen')
def next_gen():
    global voting_threshold, curr_gen_number, curr_pop
    
    db = pymysql.connect(host = db_host,
                        user = db_user,
                        password = db_pass,
                        database = db_name)

    cursor = db.cursor()

    curr_pop_mems = []
    
    # Grab all members and add to array
    for chromosome in curr_pop:
        print(chromosome)
        curr_pop_mems.append(query.retrieve_member(chromosome))
        
    # Create new pop
    new_pop = ga.single_island(curr_pop_mems)
    
    # Get new gen_number
    new_gen_number = new_pop[0].get_gen_number()
    # Make new gen number to be curr gen number
    curr_gen_number = new_gen_number
    
    # Get new pop id
    new_popID = query.add_population(new_gen_number)
    
    # Add all members individually to DB
    for chromosome in new_pop:
        query.add_member(chromosome, new_popID)
        
    # Update curr_pop    
    sql = "SELECT `populationID` FROM `populations` WHERE `generation_number` = %s"
    cursor.execute(sql, curr_gen_number)
    result = cursor.fetchone()
    curr_popID = int(re.sub('\D', '', str(result)))

    sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
    cursor.execute(sql, curr_popID)
    chromosomes = cursor.fetchall()
    
    curr_pop = []
    
    for chromosome in chromosomes:
        curr_pop.append(int(re.sub('\D', '', str(chromosome))))

    # Reset voting_threshold
    voting_threshold = 0
    
    db.commit()
    cursor.close()
    db.close()
    
    return "Next Gen Success"

##################################
# Admin control, clear entire DB #
##################################
@api.route('/clearDB')
def clearDB():
    global voting_threshold, curr_gen_number, curr_pop
    db = pymysql.connect(host = db_host,
                        user = db_user,
                        password = db_pass,
                        database = db_name)

    cursor = db.cursor()
    
    sql = ["DELETE FROM votes;", "DELETE FROM weights;", "DELETE FROM attacks;", "DELETE FROM decays;", "DELETE FROM sustains;", "DELETE FROM releases;", "DELETE FROM amplitudes;", "DELETE FROM harmonics;", "DELETE FROM base_Frequencies;", "DELETE FROM genes;", "DELETE FROM chromosomes;", "DELETE FROM populations;"]

    for sqlCall in sql:
        cursor.execute(sqlCall)

    curr_pop = ga.initial_gen()

    # Get new gen_number
    new_gen_number = curr_pop[0].get_gen_number()
    # Make new gen number to be curr gen number
    curr_gen_number = new_gen_number

    # Get new pop id
    new_popID = query.add_population(new_gen_number)
    
    # Add all members individually to DB
    for chromosome in curr_pop:
        query.add_member(chromosome, new_popID)
        
    # Update curr_pop    
    sql = "SELECT `populationID` FROM `populations` WHERE `generation_number` = %s"
    cursor.execute(sql, curr_gen_number)
    result = cursor.fetchone()
    curr_popID = int(re.sub('\D', '', str(result)))

    sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
    cursor.execute(sql, curr_popID)
    chromosomes = cursor.fetchall()

    curr_pop = []

    for chromosome in chromosomes:
        curr_pop.append(int(re.sub('\D', '', str(chromosome))))

    sql = "SELECT `generation_number` FROM `populations` WHERE `generation_number`=(SELECT max(`generation_number`) FROM `populations`)"
    cursor.execute(sql)
    curr_gen_number = cursor.fetchone()
    curr_gen_number = int(re.sub('\D', '', str(curr_gen_number)))

    print("\n\n\n\nGen Num:", curr_gen_number,"\n\n\n\n")

    # Update curr_pop    
    sql = "SELECT `populationID` FROM `populations` WHERE `generation_number` = %s"
    cursor.execute(sql, curr_gen_number)
    result = cursor.fetchone()
    curr_popID = int(re.sub('\D', '', str(result)))

    sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
    cursor.execute(sql, curr_popID)
    chromosomes = cursor.fetchall()

    for chromosome in chromosomes:
        curr_pop.append(int(re.sub('\D', '', str(chromosome))))
    #print(curr_pop)
    db.commit()
    cursor.close()
    db.close()
    
    voting_threshold = 0

    return "Clear DB Success"







####################################################################
# Initial startup code to clear DB and start an initial generation #
####################################################################

db = pymysql.connect(host = db_host,
                    user = db_user,
                    password = db_pass,
                    database = db_name)
cursor = db.cursor()

# # Reset DB and create initial gen
# clearDB()
curr_pop = ga.initial_gen()

# Get new gen_number
new_gen_number = curr_pop[0].get_gen_number()

# Make new gen number to be curr gen number
curr_gen_number = new_gen_number

# Get new pop id
new_popID = query.add_population(new_gen_number)

# Add all members individually to DB
for chromosome in curr_pop:
    query.add_member(chromosome, new_popID)
    
# Update curr_pop    
sql = "SELECT `populationID` FROM `populations` WHERE `generation_number` = %s"
cursor.execute(sql, curr_gen_number)
result = cursor.fetchone()
curr_popID = int(re.sub('\D', '', str(result)))

sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
cursor.execute(sql, curr_popID)
chromosomes = cursor.fetchall()

curr_pop = []

for chromosome in chromosomes:
    curr_pop.append(int(re.sub('\D', '', str(chromosome))))

sql = "SELECT `generation_number` FROM `populations` WHERE `generation_number`=(SELECT max(`generation_number`) FROM `populations`)"
cursor.execute(sql)
curr_gen_number = cursor.fetchone()
curr_gen_number = int(re.sub('\D', '', str(curr_gen_number)))

print("Gen Num:", curr_gen_number)

sql = "SELECT `populationID` FROM `populations` WHERE `generation_number` = %s"
cursor.execute(sql, curr_gen_number)
result = cursor.fetchone()
curr_popID = int(re.sub('\D', '', str(result)))

sql = "SELECT `chromosomeID` FROM `chromosomes` WHERE `populationID` = %s"
cursor.execute(sql, curr_popID)
chromosomes = cursor.fetchall()

for chromosome in chromosomes:
    curr_pop.append(int(re.sub('\D', '', str(chromosome))))
#print(curr_pop)

cursor.close()
db.close()

if __name__ == '__main__':
    api.run(host='0.0.0.0', port=5000, debug=True)
    