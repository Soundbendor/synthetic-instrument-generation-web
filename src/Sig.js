import React from 'react';
import 'react-h5-audio-player/lib/styles.css';
import bird from "./bird.webm"
import * as Tone from 'tone'
import {motion} from 'framer-motion/dist/framer-motion'

// Max number of frequencies
const frequency_max = 10;

// Constants to randomly set how many frequencies sound should have
const numFrequencies1 = Math.floor(Math.random() * frequency_max);
const numFrequencies2 = Math.floor(Math.random() * frequency_max);

// Sends SQL update to vote count for chromosome
function vote1()
{
  alert('Voted for sound 1!')
}

function vote2()
{
  alert('Voted for sound 2!')
}

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
  // Random values for testing
  var sound_1_fundamental = Math.floor(Math.random() * 300) + 220;
  var sound_1_attack = Array(numFrequencies1 + 1).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_1_decay = Array(numFrequencies1 + 1).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_1_sustain = Array(numFrequencies1 + 1).fill().map(() => Math.random() * (0.25).toFixed(4))
  var sound_1_release = Array(numFrequencies1 + 1).fill().map(() => (Math.random() * (1.0).toFixed(4)) * 0.5)
  var sound_1_amplitude = Array(numFrequencies1 + 1).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_2_fundamental = Math.floor(Math.random() * 500) + 220;
  var sound_2_attack = Array(numFrequencies2 + 1).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_2_decay = Array(numFrequencies2 + 1).fill().map(() => Math.random() * (1.0).toFixed(4))
  var sound_2_sustain = Array(numFrequencies2 + 1).fill().map(() => Math.random() * (0.25).toFixed(4))
  var sound_2_release = Array(numFrequencies2 + 1).fill().map(() => (Math.random() * (1.0).toFixed(4)) * 0.5)
  var sound_2_amplitude = Array(numFrequencies2 + 1).fill().map(() => Math.random() * (1.0).toFixed(4))

  // function getData() {
  //   axios({
  //     method: "GET",
  //     url:"/sound_generation",
  //   })
  //   .then((response) => {
  //     const res =response.data
  //     setSounds(({
  //       sound_1: res.sound_1,
  //       sound_2: res.sound_2}))
  //   }).catch((error) => {
  //     if (error.response) {
  //       console.log(error.response)
  //       console.log(error.response.status)
  //       console.log(error.response.headers)
  //     }
  //   })
  // }
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
            <button className = "voteButton" onClick={() => {synthesisInstrument(1, sound_1_fundamental, sound_1_attack, sound_1_decay, sound_1_sustain, sound_1_release, sound_1_amplitude, numFrequencies1)}}>Play Sound 1</button>
            <button className = "voteButton" onClick={vote1}>Vote 1</button>
            <a href = 'google.com' className = "downloadLink" id = "downloadLink1"> </a>
          </div>
          <div className = "voteBox, horizontal-center">
          <video className = "videoPlayer" width="320" height="240" autoPlay muted>
            <source src={bird} type="video/webm"/>
          Your browser does not support the video tag.
          </video>
            <button className = "voteButton" onClick={() => {synthesisInstrument(2, sound_2_fundamental, sound_2_attack, sound_2_decay, sound_2_sustain, sound_2_release, sound_2_amplitude, numFrequencies2 )}}>Play Sound 2</button>
            <button className = "voteButton" onClick={vote2}>Vote 2</button>
            <a href = 'google.com' className = "downloadLink" id = "downloadLink2"> </a>
          </div>
        </div>
      </div>
  )
}

// Assign values and play
function singleFrequency(poly, frequency, attack, decay, sustain, release, mul) {
  const now = Tone.now();
  // Weird issue with sustain
  poly.set({
    "envelope" : {
      "attack" : (attack * mul).toFixed(4),
      "decay" : (decay * mul).toFixed(4),
      "sustain" : 0,
      "release" : (release * mul).toFixed(4),
  }});
  console.log(sustain);
  poly.triggerAttackRelease([frequency], now + 1);
}

function synthesisInstrument(sound_id, fundamental, attack, decay, sustain, release, mul, numFrequencies) {
  // Create synth and connect to recorder
  const poly = new Tone.PolySynth().toDestination();
  const recorder = new Tone.Recorder();
  poly.connect(recorder);
  recorder.start();

  // Create n frequencies and pass their values
  for (let i = 0; i < numFrequencies + 1; i++) {
    singleFrequency(poly, fundamental * i+1, 
      attack[i], decay[i], sustain[i], release[i],
      mul[i]
      )
  }

  // Once done recorded, setup download link
  setTimeout(async () => {
    const recording = await recorder.stop();
    console.log(recording);
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
  }, 6000);
}