import streamlit as st
import pandas as pd
from database_functions import *
import time
import base64
import random


def playSoundButton1(path):
    #    with open("./sounds/sound 8.wav", "rb") as f:
    with open(path, "rb") as f:
            # data = f.read()
            # b64 = base64.b64encode(data).decode()
            # md = f"""
            #     <audio autoplay="true">
            #     <source src="data:audio/wav;base64,{b64}" type="audio/wav">
            #     </audio>
            #     """
            # st.markdown(
            #     md,
            #     unsafe_allow_html=True,
            # )
            
            st.audio(f)
            
def playSoundButton2(path):
    with open(path, "rb") as f:
            # data = f.read()
            # b64 = base64.b64encode(data).decode()
            # md = f"""
            #     <audio autoplay="true">
            #     <source src="data:audio/wav;base64,{b64}" type="audio/wav">
            #     </audio>
            #     """
            # st.markdown(
            #     md,
            #     unsafe_allow_html=True,
            # )
            st.audio(f)

def random_sounds():
    playlist = ["./sounds/sound 1.wav", 
                "./sounds/sound 2.wav",
                "./sounds/sound 3.wav",
                "./sounds/sound 4.wav",
                "./sounds/sound 5.wav",
                "./sounds/sound 6.wav",
                "./sounds/sound 7.wav"]
    choices = ["", ""]
    
    while choices[0] == choices[1]:
            choices[0] = random.choice(playlist)
            choices[1] = random.choice(playlist)
    return tuple(choices)

def main():    
    st.set_page_config(page_title="Synthetic Instrument Generation", page_icon=":musical_keyboard:", layout="wide")
    
    menu = ["Home", "Sounds","About"]

    # Create Navigation Dropdown Menu
    choice = st.sidebar.selectbox("menu", menu)
    
    if choice == "Home":
        st.title("Home")
        col1, col2, col3 = st.columns(3)
        with col2:
            st.image("images/db.png")
    elif choice == "Sounds":
        st.title("Sounds")
        
        # Doesn't check to see if they're the same or not
        random_choices = random_sounds()
        
        print("playable random_sounds: ", random_choices)
  
        with st.container():
            # Separate into 4 columns, then place in the two center columns
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.subheader("Vote")
                st.subheader("Play")
            with col2:
                button1 = st.button("Sound A", on_click = voteButtonAClick)
                playButton1 = st.button("▶", key = 1, on_click = playSoundButton1, args =(random_choices[0],))
            with col3:
                button2 = st.button("Sound B", on_click = voteButtonBClick)
                playButton2 = st.button("▶ ", key = 2, on_click = playSoundButton2, args =(random_choices[1],))
            with col4:
                st.subheader("Total Votes" + ": " + str(voteCount))
                
    else:
        st.title("About")
        st.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit,\nsed do eiusmod tempor incididunt ut labore et dolore magna\naliqua. Ut enim ad minim veniam, quis nostrud exercitation\nullamco laboris nisi ut aliquip ex ea commodo consequat.\nDuis aute irure dolor in reprehenderit in voluptate velit\nesse cillum dolore eu fugiat nulla pariatur. Excepteur sint\noccaecat cupidatat non proident, sunt in culpa qui officia\ndeserunt mollit anim id est laborum.")
    
        
if __name__ == '__main__':
    main()