import mysql.connector
import streamlit as st

voteCount = 0

def voteButtonAClick():
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