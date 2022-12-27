import mysql.connector
import streamlit as st

def voteButtonAClick():
    cnx = mysql.connector.connect(user='brad01', password='stayout123',
                              host='74.208.128.230',
                              database='brad01')
    cursor = cnx.cursor()
    
    cursor.execute("show tables")
  
    result = cursor.fetchall()
    
    for row in result:
        print(row)
        
    cnx.close()
    
    #st.experimental_rerun()
    
def voteButtonBClick():
    cnx = mysql.connector.connect(user='brad01', password='stayout123',
                              host='74.208.128.230',
                              database='brad01')
    cursor = cnx.cursor()
    
    cursor.execute("show tables")
  
    result = cursor.fetchall()
    
    for row in result:
        print(row)
        
    cnx.close()