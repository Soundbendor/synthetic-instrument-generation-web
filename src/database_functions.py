import mysql.connector
import streamlit as st
import pyodbc

voteCount = 0

def voteButtonAClick():
    global voteCount
    cnxn_str = ("Driver={SQL Server Native Client 11.0};"
                "Server=siga.cmnz4advdpzd.us-west-2.rds.amazonaws.com;"
                "Database=siga;"
                "UID=admin;"
                "PWD=Beaver!1;")
    cnxn = pyodbc.connect(cnxn_str)
    
    cursor = cnxn.cursor()

    query = "CREATE TABLE [dbo].[populations] ([populationID] INT NOT NULL IDENTITY(1, 1), [GENERATION_NUMBER] INT NOT NULL, PRIMARY KEY (populationID));"

    cursor.execute(query)
    cnxn.close()
    
    voteCount += 1
    
    #st.experimental_rerun()
    
def voteButtonBClick():
    global voteCount
    cnx = mysql.connector.connect(user='brad01', password='stayout123',
                              host='74.208.128.230',
                              database='brad01')
    cursor = cnx.cursor()
    
    cursor.execute("show tables")
  
    result = cursor.fetchall()
    
    for row in result:
        print(row)
        
    cnx.close()
    
    voteCount += 1