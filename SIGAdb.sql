create table populations (
  populationID int,
  generation_number, int,
  PRIMARY KEY (populationID)
 );
 
create table chromosomes (
   chromosomeID int,
   populationID int, 
   FOREIGN KEY (populationid) REFERENCES populations(populationid),
   PRIMARY key (chromosomeID)
  );

create table weights (
   chromosomeID int, 
   FOREIGN KEY (chromosomeID) REFERENCES chromosomes(chromosomeID)
  );

create table base_Frequencies (
   chromosomeID int, 
   FOREIGN KEY (chromosomeID) REFERENCES chromosomes(chromosomeID)
  );

create table genes (
   geneID int,
   chromosomeID int, 
   FOREIGN KEY (chromosomeID) REFERENCES chromosomes(chromosomeID),
   primary key (geneid)
  );

create table harmonics (
   harmonicID int,
   value int,
   geneID int,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (harmonicID)
  );

create table amplitudes (
   amplitudeID int,
   value int,
   geneID int,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (amplitudeID)
  );

create table attacks (
   attacksID int,
   value int,
   geneID int,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (attacksID)
  );

create table decays (
   decaysID int,
   value int,
   geneID int,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (decaysID)
  );

create table sustains (
   sustainID int,
   value int,
   geneID int,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (sustainID)
  );

create table releases (
   releaseID int,
   value int,
   geneID int,
   FOREIGN KEY (geneID) REFERENCES genes(geneID),
   primary key (releaseID)
  );