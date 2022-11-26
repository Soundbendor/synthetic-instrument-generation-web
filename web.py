import streamlit as st
import pandas as pd

st.set_page_config(page_title="Synthetic Instrument Generation", page_icon=":musical_keyboard:", layout="wide")

def soundButtonAClick():
    print("A")
def soundButtonBClick():
    print("B")
    
    
def main():    
    menu = ["Home", "Sounds","About"]
    
    choice = st.sidebar.selectbox("menu", menu)
    
    if choice == "Home":
        st.title("Home")
    elif choice == "Sounds":
        st.title("Sounds")
        with st.container():
            col1, col2, col3, col4 = st.columns(4)
            with col2:
                button1 = st.button("Sound A", on_click = soundButtonAClick)
            with col3:
                button2 = st.button("Sound B", on_click = soundButtonBClick)
    else:
        st.title("About")
    
        
if __name__ == '__main__':
    main()