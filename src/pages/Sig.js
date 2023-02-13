import React from 'react';
import 'react-h5-audio-player/lib/styles.css';
import * as Tone from 'tone'
import {motion} from 'framer-motion/dist/framer-motion'
import {useCookies} from 'react-cookie';
import axios from 'axios';

import bird from "../video/bird.webm"

const bigDataApiKey = `bdc_f8d653f72e4743f2bb8f8b8e56c5e86bbdc_f8d653f72e4743f2bb8f8b8e56c5e86b`

const ipTest = '127.0.0.1'
const locationTest = 'corvallis'

let instrument_1 = {}
let instrument_2 = {}

// Constants to randomly set how many frequencies sound should have

// This is causing issues and unnecessary, I should simply grab this from the GA and count
// The amount of harms to determine how long
// const numFrequencies1 = Math.floor(Math.random() * frequency_max);
// const numFrequencies2 = Math.floor(Math.random() * frequency_max);

const chromosomeID_1 = 28;
const chromosomeID_2 = 28;

// This needs to include randomization and hosting of the audio players on the web server
const Sig = () => {
  console.clear();
  return (
    <AudioPlayers/>
  )
};

export default Sig;

function AudioPlayers()
{
  const [cookies, setCookie] = useCookies();

  getInstrument_1(chromosomeID_1)
  getInstrument_2(chromosomeID_2)
  
  // Sends SQL update to vote count for chromosome
  // Run a python script example
  // Need to make a lot of changes to this to make it work
  async function vote1(chromosomeID) {
    axios({
      method: "GET",
      url:"/vote",
      params: {chromosomeID}
    })
    .then((response) => {
    }).catch((error) => {
      if (error.response) {
      }
    })
    if ((Number(cookies.votes) + 1) >= 10) {
      setCookie('votes', 0);
    }
    else {
      setCookie('votes', (Number(cookies.votes) + 1).toString());
    }
    console.log(instrument_1)
  }

  async function vote2(chromosomeID) {
    if ((Number(cookies.votes) + 1) >= 10) {
      setCookie('votes', 0);
    }
    else {
      setCookie('votes', (Number(cookies.votes) + 1).toString());
    }
    console.log(instrument_2)
  }

  // Function to get sounds
  function getInstrument_1(chromosomeID) {
    axios({
      method: "GET",
      url:"/retrieve_member",
      params: {chromosomeID}
    })
    .then((response) => {
      const res = response.data
      instrument_1 = res
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
  }

    // Function to get sounds
    function getInstrument_2(chromosomeID) {
      axios({
        method: "GET",
        url:"/retrieve_member",
        params: {chromosomeID}
      })
      .then((response) => {
        const res = response.data
        instrument_2 = res
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
            <button className = "voteButton" onClick={() => {
              synthesisInstrument(1, instrument_1.harms, instrument_1.attacks, instrument_1.decays, instrument_1.sustains, instrument_1.releases, instrument_1.amps)
              }}>Play Sound 1</button>
            <button className = "voteButton" onClick={() => {vote1(chromosomeID_1, ipTest, locationTest)}}>Vote 1</button>
            <a href = 'google.com' className = "downloadLink" id = "downloadLink1"> </a>
          </div>
          <div className = "voteBox, horizontal-center">
          <video className = "videoPlayer" width="320" height="240" autoPlay muted>
            <source src={bird} type="video/webm"/>
          Your browser does not support the video tag.
          </video>
            <button className = "voteButton" onClick={() => {synthesisInstrument(2, instrument_2.harms, instrument_2.attacks, instrument_2.decays, instrument_2.sustains, instrument_2.releases, instrument_2.amps)}}>Play Sound 2</button>
            <button className = "voteButton" onClick={vote2}>Vote 2</button>
            <a href = 'google.com' className = "downloadLink" id = "downloadLink2"> </a>
          </div>
        </div>
      </div>
  )
}

// Assign values and play
function singleFrequency(poly, frequency, attack, decay, sustain, release, mul) {
  const now = Tone.now()
  console.log("Test")
  poly.set({
    "envelope" : {
      "attack": attack,
      "decay": decay,
      "sustain": sustain,
      "release": release
    }
  })
  //0.1 is how long the note is held for
  poly.triggerAttackRelease(frequency, 0.01, now, mul);
}

function synthesisInstrument(sound_id, harms, attack, decay, sustain, release, mul) {
  // Create synth and connect to recorder
  const poly = new Tone.PolySynth().toDestination();
  const recorder = new Tone.Recorder();
  poly.connect(recorder);
  recorder.start();

  // Create n frequencies and pass their values
  for (let i = 0; i < 10; i++) {
    singleFrequency(
      poly, 
      harms[i], 
      attack[i], 
      decay[i], 
      sustain[i], 
      release[i],
      mul[i]
    )
  }

  // Once done recorded, setup download link
  setTimeout(async () => {

    const recording = await recorder.stop();
    const url = URL.createObjectURL(recording);
    if (sound_id === 1) {
      const anchor = document.querySelector("#downloadLink1");
      anchor.download = "sound_1.webm";
      anchor.href = url;
      anchor.innerHTML = "Download now!";
    }
    else {
      const anchor = document.querySelector("#downloadLink2");
      anchor.download = "sound_2.webm";
      anchor.type = "audio/webm"
      anchor.href = url;
      anchor.innerHTML = "Download now!";
    }
  }, 4000);
}