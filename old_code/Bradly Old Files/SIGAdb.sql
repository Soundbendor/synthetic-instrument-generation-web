USE [siga]
create table populations (
  populationID int NOT NULL identity(1, 1),
  generation_number int NOT NULL,
  PRIMARY KEY (populationID)
 );
 
create table chromosomes (
   chromosomeID int NOT NULL identity(1, 1),
   populationID int NOT NULL, 
   parentChromosomeID int NOT NULL,
   childrenChromosomeID int NOT NULL,
   FOREIGN KEY (populationid) REFERENCES populations(populationid),
   PRIMARY key (chromosomeID)
  );

create table weights (
   chromosomeID int NOT NULL identity(1, 1), 
   FOREIGN KEY (chromosomeID) REFERENCES chromosomes(chromosomeID)
  );

create table base_Frequencies (
   chromosomeID int NOT NULL identity(1, 1), 
   FOREIGN KEY (chromosomeID) REFERENCES chromosomes(chromosomeID)
  );

create table genes (
   geneID int NOT NULL identity(1, 1),
   chromosomeID int NOT NULL, 
   FOREIGN KEY (chromosomeID) REFERENCES chromosomes(chromosomeID),
   primary key (geneid)
  );

create table harmonics (
   harmonicID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (harmonicID)
  );

create table amplitudes (
   amplitudeID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (amplitudeID)
  );

create table attacks (
   attacksID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (attacksID)
  );

create table decays (
   decaysID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (decaysID)
  );

create table sustains (
   sustainID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (sustainID)
  );

create table releases (
   releaseID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (releaseID)
  );
  
create table votes (
   releaseID int NOT NULL identity(1, 1),
   value int NOT NULL,
   geneID int NOT NULL,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (releaseID)
  );