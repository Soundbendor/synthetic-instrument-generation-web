import React from 'react';
import 'react-h5-audio-player/lib/styles.css';
import * as Tone from 'tone'
import {motion} from 'framer-motion/dist/framer-motion'
import {useCookies} from 'react-cookie';
import axios from 'axios';

import bird from "../video/bird.webm"

// Max number of frequencies
const frequency_max = 10;

let instrument_1 = {}
let instrument_2 = {}

// Constants to randomly set how many frequencies sound should have
const numFrequencies1 = Math.floor(Math.random() * frequency_max);
const numFrequencies2 = Math.floor(Math.random() * frequency_max);

const chromosomeID_1 = 8;
const chromosomeID_2 = 8;

// This needs to include randomization and hosting of the audio players on the web server
const Sig = () => {
  console.clear();
  return (
    <AudioPlayers/>
  )
};

export default Sig;

function AudioPlayers(props)
{
  const [cookies, setCookie] = useCookies();

  getInstrument_1(chromosomeID_1)
  getInstrument_2(chromosomeID_2)
  
  // Sends SQL update to vote count for chromosome
  // Run a python script example
  async function vote1() {
    if ((Number(cookies.votes) + 1) >= 10) {
      setCookie('votes', 0);
    }
    else {
      setCookie('votes', (Number(cookies.votes) + 1).toString());
    }
    console.log(instrument_1)
  }

  async function vote2() {
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
    return axios({
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
      return axios({
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
              synthesisInstrument(1, instrument_1.harms, instrument_1.attacks, instrument_1.decays, instrument_1.sustains, instrument_1.releases, instrument_1.amps, numFrequencies1)
              }}>Play Sound 1</button>
            <button className = "voteButton" onClick={vote1}>Vote 1</button>
            <a href = 'google.com' className = "downloadLink" id = "downloadLink1"> </a>
          </div>
          <div className = "voteBox, horizontal-center">
          <video className = "videoPlayer" width="320" height="240" autoPlay muted>
            <source src={bird} type="video/webm"/>
          Your browser does not support the video tag.
          </video>
            <button className = "voteButton" onClick={() => {synthesisInstrument(2, instrument_2.harms, instrument_2.attacks, instrument_2.decays, instrument_2.sustains, instrument_2.releases, instrument_2.amps, numFrequencies2 )}}>Play Sound 2</button>
            <button className = "voteButton" onClick={vote2}>Vote 2</button>
            <a href = 'google.com' className = "downloadLink" id = "downloadLink2"> </a>
          </div>
        </div>
      </div>
  )
}

// Assign values and play
function singleFrequency(poly, frequency, attack, decay, sustain, release, mul) {
  // Weird issue with sustain
  var ampEnv = new Tone.AmplitudeEnvelope({
    "attack": (attack * mul),
    "decay": (decay * mul),
    "sustain": (sustain * mul),
    "release": (release * mul),
  }).toDestination();
  poly.connect(ampEnv)
  poly.triggerAttackRelease([frequency], 0.1);
}

function synthesisInstrument(sound_id, harms, attack, decay, sustain, release, mul, numFrequencies) {
  // Create synth and connect to recorder
  const poly = new Tone.PolySynth().toDestination();
  const recorder = new Tone.Recorder();
  poly.connect(recorder);
  recorder.start();

  // Create n frequencies and pass their values
  for (let i = 0; i < numFrequencies + 1; i++) {
    singleFrequency(poly, harms[i], 
      attack[i], decay[i], sustain[i], release[i],
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