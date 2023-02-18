from flask import Flask, Response, request
from pyo import *
import pymysql
import os
import numpy
import ga
import random
from datetime import datetime

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
    
    chromosomeID = random_chromosome

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
    db = pymysql.connect(host = 'sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com',
            user = 'admin',
            password = 'Beaver!1',
            database = 'sig')

    cursor = db.cursor()
    
    chromosomeID = request.args.get('chromosomeID')
    ip = request.args.get('ip')
    location = request.args.get('location')
    votes = request.args.get('currVotes')
    
    
    
    print("------------------\nVotes: \n", votes, "\n--------------")
    
    sql = """INSERT INTO `votes` 
            (winnerID, location, timestamp, IP)
            VALUES (%s, %s, %s, %s)"""
        
    cursor.execute(sql, (chromosomeID, location, datetime.now(), ip))
    cursor.close()
    return "Success"
    

if __name__ == '__main__':
    api.run(host='127.0.0.1', port=5000, debug=True)