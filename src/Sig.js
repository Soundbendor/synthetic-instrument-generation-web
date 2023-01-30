import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";
import bird from "./bird.webm"
import * as Tone from 'tone'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'

const numFrequencies = 10;

//import Animal from "react-animals";
//import AWS from 'aws-sdk'

// Sends SQL update to vote count for chromosome
function vote1()
{
  alert('vote1')
}

function vote2()
{
  alert('vote2')
}

// This needs to include randomization and hosting of the audio players on the web server
const Sig = () => {
  return (
    <AudioPlayers/>
  )
};
  
  export default Sig;

function AudioPlayers(props)
{
  const [sounds, setSounds] = React.useState(null)

  function getData() {
    axios({
      method: "GET",
      url:"/sound_generation",
    })
    .then((response) => {
      const res =response.data
      setSounds(({
        sound_1: res.sound_1,
        sound_2: res.sound_2}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
  }

  return (
      <div>
        <div>
          <motion.div initial={{opacity:0}} animate = {{opacity: 1}} exit={{opacity:0}}>
            <h1>Synthetic Instrument Generation</h1>;
          </motion.div>
        </div>
        <div>
          <div className = "voteBox horizontal-center">
            <video className = "videoPlayer" width="320" height="240" autoPlay muted>
              <source src={bird} type="video/webm"/>
            Your browser does not support the video tag.
            </video>
            <button className = "voteButton" onClick={() => {synthesisInstrument(220)}}>Play Sound 1</button>
            <button className = "voteButton" onClick={vote1}>Vote 1</button>
          </div>
          <div className = "voteBox, horizontal-center">
          <video className = "videoPlayer" width="320" height="240" autoPlay muted>
            <source src={bird} type="video/webm"/>
          Your browser does not support the video tag.
          </video>
            <button className = "voteButton" onClick={() => {synthesisInstrument(330)}}>Play Sound 2</button>
            <button className = "voteButton" onClick={vote2}>Vote 2</button>
          </div>
          {sounds && <div>
            <p>Sound_1: {sounds.sound_1}</p>
            <p>Sound_2: {sounds.sound_2}</p>
          </div>
          }
        </div>
      </div>
  )
}

function singleFrequency(frequency, attack, decay, sustain, release) {
  const poly = new Tone.PolySynth(Tone.Synth).toDestination();
  poly.set({
    "envelope" : {
      "attack" : attack,
      "decay" : decay,
      "sustain" : sustain,
      "release" : release
  }});
  poly.triggerAttackRelease([frequency]);
}

function synthesisInstrument(fundamental) {
  for (let i = 1; i < numFrequencies + 1; i++) {
    singleFrequency(fundamental * i, 0.1, 1.0, 0, 25)
  }
}