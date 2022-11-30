import streamlit as st
import pandas as pd
from database_functions import soundButtonAClick, soundButtonBClick

def main():    
    st.set_page_config(page_title="Synthetic Instrument Generation", page_icon=":musical_keyboard:", layout="wide")
    
    menu = ["Home", "Sounds","About"]
    
    # Create Navigation Dropdown Menu
    choice = st.sidebar.selectbox("menu", menu)
    
    if choice == "Home":
        st.title("Home")
    elif choice == "Sounds":
        st.title("Sounds")
        with st.container():
            # Separate into 4 columns, then place in the two center columns
            col1, col2, col3, col4 = st.columns(4)
            with col2:
                button1 = st.button("Sound A", on_click = soundButtonAClick)
            with col3:
                button2 = st.button("Sound B", on_click = soundButtonBClick)
    else:
        st.title("About")
    
        
if __name__ == '__main__':
    main()