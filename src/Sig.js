import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";
import bird from "./bird.webm"
import * as Tone from 'tone'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'

const numFrequencies1 = Math.floor(Math.random() * 10);
const numFrequencies2 = Math.floor(Math.random() * 10);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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

  var sound_1_fundamental = Math.floor(Math.random() * 500) + 220;
  var sound_1_attack = Array(11).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_1_decay = Array(11).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_1_sustain = Array(11).fill().map(() => Math.random() * (0.25).toFixed(4))
  var sound_1_release = Array(11).fill().map(() => (Math.random() * (1.0).toFixed(4)) * 0.5)
  var sound_1_amplitude = Array(11).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_2_fundamental = Math.floor(Math.random() * 500) + 220;
  var sound_2_attack = Array(11).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_2_decay = Array(11).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_2_sustain = Array(11).fill().map(() => Math.random() * (0.25).toFixed(4))
  var sound_2_release = Array(11).fill().map(() => (Math.random() * (1.0).toFixed(4)) * 0.5)
  var sound_2_amplitude = Array(11).fill().map(() => Math.random() * (1.0).toFixed(4))

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
            <button className = "voteButton" onClick={() => {synthesisInstrument(sound_1_fundamental, sound_1_attack, sound_1_decay, sound_1_sustain, sound_1_release, sound_1_amplitude, numFrequencies1)}}>Play Sound 1</button>
            <button className = "voteButton" onClick={vote1}>Vote 1</button>
          </div>
          <div className = "voteBox, horizontal-center">
          <video className = "videoPlayer" width="320" height="240" autoPlay muted>
            <source src={bird} type="video/webm"/>
          Your browser does not support the video tag.
          </video>
            <button className = "voteButton" onClick={() => {synthesisInstrument(sound_2_fundamental, sound_2_attack, sound_2_decay, sound_2_sustain, sound_2_release, sound_2_amplitude, numFrequencies2 )}}>Play Sound 2</button>
            <button className = "voteButton" onClick={vote2}>Vote 2</button>
          </div>
          {/* {sounds && <div>
            <p>Sound_1: {sounds.sound_1}</p>
            <p>Sound_2: {sounds.sound_2}</p>
          </div>
          } */}
        </div>
      </div>
  )
}

function singleFrequency(frequency, attack, decay, sustain, release, mul) {
  const poly = new Tone.PolySynth(Tone.Synth).toDestination();
  poly.set({
    "envelope" : {
      "attack" : attack * mul,
      "decay" : decay * mul,
      "sustain" : 0,
      "release" : release * mul,
  }});
  
  poly.triggerAttackRelease([frequency]);

}

function synthesisInstrument(fundamental, attack, decay, sustain, release, mul, numFrequencies) {
  for (let i = 0; i < numFrequencies + 1; i++) {
    singleFrequency(fundamental * i+1, 
      attack[i], decay[i], sustain[i], release[i],
      mul[i]
      )
  }
}