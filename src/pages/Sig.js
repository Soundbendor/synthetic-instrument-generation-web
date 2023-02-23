import React from 'react';
import 'react-h5-audio-player/lib/styles.css';
import * as Tone from 'tone'
import {motion} from 'framer-motion/dist/framer-motion'
import {useCookies} from 'react-cookie';
import axios from 'axios';
import bird from "../video/bird.webm"

let ip = ''
let location = ''
let instrument_1 = {}
let instrument_2 = {}
let currVotes = 0

// Get IP and geolocation
axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=abe1a825ca4c4a7b83a74c4486f4ace1')
    .then(response => {
      ip = response.data.ip_address
      location = response.data.city
    })
    .catch(error => {
      console.log(error);
});

const Sig = () => {
  console.clear();
  return (
    <AudioPlayers/>
  )
};

export default Sig;

function AudioPlayers()
{
  const [cookies, setCookie] = useCookies()
  getInstrument_1()
  getInstrument_2()
  
  // Sends SQL update to vote count for chromosome
  async function vote(chromosomeID, ip, location) {
    axios({
      method: "GET",
      url:"/vote",
      params: {chromosomeID, ip, location, currVotes}
    })
    .then((response) => {
      const res = response.data
      console.log(res)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
    if ((Number(cookies.votes) + 1) >= 5) {
      setCookie('votes', 0);
      currVotes = 0;
    }
    else {
      setCookie('votes', (Number(cookies.votes) + 1).toString());
      currVotes = currVotes + 1
    }
  }

  // Function to get sounds
  function getInstrument_1() {
    axios({
      method: "GET",
      url:"/retrieve_member",
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
  
  function getInstrument_2() {
    axios({
      method: "GET",
      url:"/retrieve_member",
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
          <button className = "voteButton" onClick={() => {vote(instrument_1.chromosomeID, ip, location)}}>Vote 1</button>
          <a href = 'google.com' className = "downloadLink" id = "downloadLink1"> </a>
        </div>
        <div className = "voteBox, horizontal-center">
        <video className = "videoPlayer" width="320" height="240" autoPlay muted>
          <source src={bird} type="video/webm"/>
        Your browser does not support the video tag.
        </video>
          <button className = "voteButton" onClick={() => {synthesisInstrument(2, instrument_2.harms, instrument_2.attacks, instrument_2.decays, instrument_2.sustains, instrument_2.releases, instrument_2.amps)}}>Play Sound 2</button>
          <button className = "voteButton" onClick={() => vote(instrument_2.chromosomeID, ip, location)}>Vote 2</button>
          <a href = 'google.com' className = "downloadLink" id = "downloadLink2"> </a>
        </div>
      </div>
    </div>
  )
}

// Assign values and play
function singleFrequency(poly, frequency, attack, decay, sustain, release, mul) {
  const now = Tone.now()
  poly.set({
    "envelope" : {
      "attack": attack,
      "decay": decay,
      "sustain": sustain,
      "release": release
    }
  })
  // 0.01 is how long the note is held for
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
      harms[i] * 220, 
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
