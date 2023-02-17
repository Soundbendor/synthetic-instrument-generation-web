from flask import Flask, Response, request
from pyo import *
import pymysql
import os
import numpy
from datetime import datetime

# List of global constants

# Number of chromosomes in each generation
mems_per_pop = 8

# Number of chromosomes used for matingpool
num_parents = mems_per_pop // 2

# Number of genes each chromosome should have, should not be adjusted
num_genes = 6

# Number of values in each gene
gene_length = 10

# Maximum score of functions used to normalize values into range
max_score = gene_length

# Used to determine how many fitness helper we have in total
num_funcs = 24

# Number of selection functions
num_selection = 5

# Determines which crossover function is used, 0 for tournament, 1 for elitism, 2 for variety, 3 for roulette, 4 for rank
selected_selection = 0

# Number of crossover functions
num_crossover = 3

# Determines which crossover function is used, 0 for midpoint, 1 for uniform, 2 for deep uniform
selected_crossover = 2

# Number of mutation functions
num_mutation = 3

# Used to determine chance of mutation occurence in each generation
chance = 1

# Boolean that switches between sound version (floats) and instrument version (ratios)
sound_mode = False

# Number of generations made on a single island before cross mingling occurs
gen_loops = 10

# Number of times islands swap members and run generations
island_loops = 3

# Used to scale how aggresively the mutation function changes the genes
mutate_scalar = 0.05

# Used for generating wav files so we can better understand the meaningful differences between the sounds
universal_base_freq = 260

# For testing purposes, makes it so wav files aren't generated if you don't want them
generate_files = True

# Number of islands each generation in representation, with current representation should always be an even number
num_isles = 20

api = Flask(__name__)



class GA:
    # Stores the harms, amps, adsr env, weights, and base freq if applicable

    def __init__(self):

        # Set up most of the values, will still need a setter method for certain edge cases

        self.harms = numpy.random.uniform(low=50.0, high=2500.0, size=gene_length)
        self.amps = numpy.random.uniform(low=0.0, high = 1 / gene_length, size=gene_length)
        self.a = numpy.random.uniform(low=0.0, high=0.2, size=gene_length)
        self.d = numpy.random.uniform(low=0.0, high=0.2, size=gene_length)
        self.s = numpy.random.uniform(low=0.0, high=1.0, size=gene_length)
        self.r = numpy.random.uniform(low=0.0, high=3.0, size=gene_length)
        self.weights = numpy.random.uniform(low=0.0, high=5.0, size=num_funcs)
        self.base_freq = random.uniform(50.0, 170.0)

        # Database relevant parts
        self.populationID = 0
        self.chromosomeID = 0
        self.geneID = 0
        self.parent1 = 0
        self.parent2 = 0


        self.genes = [self.harms, self.amps, self.a, self.d, self.s, self.r]


    def init_harms(self):

        # Used to account for whether the program is running or sound mode or ratio mode
        # By default. __init__ will generate the harms as if they were in sound mode
        # init_harms should still be called even if you're running in sound mode 

        if(not sound_mode):
            self.harms = numpy.random.uniform(low=1.0, high=20.0, size=gene_length)
            self.harms = numpy.sort(self.harms)
            self.harms[0] = 1.0
            self.genes[0] = self.harms
        else:
            #print("No need to change, it's in sound mode")
            return


    def set_harms(self, h):

        # Function is given an array that will become the new self.harms
        # Keep in mind that self.genes is updated to otherwise genes would not get the change from self.harms

        self.harms = h
        self.genes[0] = h


    def set_amps(self, a):

        # Function is given an array that will become the new self.amps
        # Keep in mind that self.genes is updated to otherwise genes would not get the change from self.amps

        self.amps = a
        self.genes[1] = a


    def set_a(self, a):

        # Function is given an array that will become the new self.a
        # Keep in mind that self.genes is updated to otherwise genes would not get the change from self.a

        self.a = a
        self.genes[2] = a


    def set_d(self, d):

        # Function is given an array that will become the new self.d
        # Keep in mind that self.genes is updated to otherwise genes would not get the change from self.d

        self.d = d
        self.genes[3] = d


    def set_s(self, s):

        # Function is given an array that will become the new self.s
        # Keep in mind that self.genes is updated to otherwise genes would not get the change from self.s

        self.s = s
        self.genes[4] = s


    def set_r(self, r):

        # Function is given an array that will become the new self.r
        # Keep in mind that self.genes is updated to otherwise genes would not get the change from self.r

        self.r = r
        self.genes[5] = r


    def set_genes(self, g):

        # Function is given an array that will become the new self.genes
        # Keep in mind that the harms, amps etc. are updated since otherwise changing genes would not change self.harms, self.amps etc.

        self.genes = g

        self.harms = g[0]
        self.amps = g[1]
        self.a = g[2]
        self.d = g[3]
        self.s = g[4]
        self.r = g[5]

    def set_weights(self, w):

        # Function is given an array that will become self.weights

        self.weights = w

    def set_base_freq(self, freq):

        # Setter for base frequency
        self.base_freq = freq


    def get_harms(self):

        # Returns harmonics
        return self.harms

    def get_amps(self):

        # Returns amplitudes
        return self.amps

    def get_a(self):

        # Returns attack of adsr envelope
        return self.a

    def get_d(self):

        # Returns decay of adsr envelope
        return self.d

    def get_s(self):

        # Returns sustain of adsr envelope
        return self.s

    def get_r(self):

        # Returns release of adsr envelope
        return self.r

    def get_weight(self, index):

        # Returns the weight of a specific fitness helper determined by index
        return self.weights[index]

    def get_weights(self):

        # Returns the entire weight array instead of a specific weight
        return self.weights

    def get_genes(self):

        # Returns harms, amps and ADSR envelope as an array
        return self.genes

    def get_base_freq(self):

        # Getter for base frequency
        return self.base_freq

    def set_popID(self,popID):

        # Setter method for populationID
        self.populationID = popID

    def set_chromosomeID(self, chromoID):

        # Setter method for chromosomeID
        self.chromosomeID = chromoID 

    def set_geneID(self, geneID):

        # Setter method for geneID
        self.geneID = geneID

    def set_parent1(self, par1):

        # Setter method for parent1
        self.parent1 = par1

    def set_parent2(self, par2):

        # Setter method for parent2
        self.parent2 = par2

    def get_popID(self):

        # Getter method for populationID
        return self.populationID

    def get_chromosomeID(self):

        # Getter method for chromosomeID
        return self.chromosomeID

    def get_geneID(self):

        # Getter method for geneID
        return self.geneID

    def get_parent1(self):

        # Getter method for parent1
        return self.parent1

    def get_parent2(self):

        # Getter method for parent2
        return self.parent2


    def reset(self):

        self.harms = numpy.random.uniform(low=50.0, high=2500.0, size=gene_length)
        self.amps = numpy.random.uniform(low=0.0, high = 1 / gene_length, size=gene_length)
        self.a = numpy.random.uniform(low=0.0, high=0.2, size=gene_length)
        self.d = numpy.random.uniform(low=0.0, high=0.2, size=gene_length)
        self.s = numpy.random.uniform(low=0.0, high=1.0, size=gene_length)
        self.r = numpy.random.uniform(low=0.0, high=3.0, size=gene_length)
        self.weights = numpy.random.uniform(low=0.0, high=5.0, size=num_funcs)
        self.base_freq = random.uniform(50.0, 170.0)

        self.genes = [self.harms, self.amps, self.a, self.d, self.s, self.r]

# Either do a random query on 2 sounds, or gain this from the GA
@api.route('/retrieve_member')
def retrieve_member():
    db = pymysql.connect(host = 'sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com',
                user = 'admin',
                password = 'Beaver!1',
                database = 'sig')

    cursor = db.cursor()

    # Finds a member given their chromosome ID then returns the harmonics, amplitudes and adsr values of that member
    chromosomeID = request.args.get('chromosomeID')
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

    member = GA()

    member_genes = [harms,amps,a,d,s,r]

    member.set_genes(member_genes)
    member.set_popID(populationID)
    member.set_chromosomeID(chromosomeID)
    member.set_geneID(geneID)
    member.set_parent1(parent1)
    member.set_parent2(parent2)
    
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
    # Finds a member given their chromosome ID then returns the harmonics, amplitudes and adsr values of that member
    chromosomeID = request.args.get('chromosomeID')
    ip = request.args.get('ip')
    location = request.args.get('location')
    # Gets the geneID with the corresponding chromosomeID
    sql = """INSERT INTO `votes` 
            (winnerID, location, timestamp, IP)
            VALUES (%s, %s, %s, %s)
        """
    cursor.execute(sql, (chromosomeID, location, datetime.now(), ip))
    return "Success"
    

if __name__ == '__main__':
    api.run(host='127.0.0.1', port=5000, debug=True)