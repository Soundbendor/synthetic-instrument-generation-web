import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from "axios";
import bird from "./bird.webm"
import * as Tone from 'tone'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'

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
              <AudioPlayer className = "audioPlayer"
                src={"https://cdn.freesound.org/previews/321/321029_5123851-lq.mp3"}
                onPlay={e => console.log("onPlay")}
                customAdditionalControls = {[]}
                showJumpControls={false}
              />

            <button className = "voteButton" onClick = {getData}>Vote 1</button>
          </div>
          <div className = "voteBox, horizontal-center">
          <video className = "videoPlayer" width="320" height="240" autoPlay muted>
            <source src={bird} type="video/webm"/>
          Your browser does not support the video tag.
          </video>
          <AudioPlayer
              src={"https://cdn.freesound.org/previews/321/321029_5123851-lq.mp3"}
              onPlay={e => console.log("onPlay")}
              customAdditionalControls = {[]}
              showJumpControls={false}
            />
              <button className = "voteButton" onClick = {vote2}>Vote 2</button>
          </div>
          {sounds && <div>
            <p>Sound_1: {sounds.sound_1}</p>
            <p>Sound_2: {sounds.sound_2}</p>
          </div>
          }
        </div>
          <SynthesisInstrument/>
      </div>
  )
}




function SynthesisInstrument(props) {
  // var ampEnv = new Tone.AmplitudeEnvelope({
  //   "attack": 1.0,
  //   "decay": 0.2,
  //   "sustain": 0.0,
  //   "release": 5.0
  // }).toDestination();

  const poly = new Tone.PolySynth(Tone.Synth).toDestination();
  const poly2 = new Tone.PolySynth(Tone.Synth).toDestination();

  poly.set({
    "envelope" : {
      "attack" : 0.1
    }
  });

  poly.set({
    "envelope" : {
      "decay" : 1
    }
  });

  poly.set({
    "envelope" : {
      "sustain" : 1.0
    }
  });

  poly.set({
    "envelope" : {
      "release" : 25.0
    }
  });

  poly2.set({
    "envelope" : {
      "attack" : 0.1
    }
  });

  poly2.set({
    "envelope" : {
      "decay" : 1
    }
  });

  poly2.set({
    "envelope" : {
      "sustain" : 0.5
    }
  });

  poly2.set({
    "envelope" : {
      "release" : 100.0
    }
  });

  poly.triggerAttackRelease([1100]);
  poly2.triggerAttackRelease([220]);
  poly2.triggerAttackRelease([330]);
  poly2.triggerAttackRelease([440]);

  // for (let i = 0; i < 8; i++) {
  //   const osc = new Tone.Oscillator(i * 330, "sine").connect(ampEnv).start();
  //   ampEnv.triggerAttackRelease(now)
  // }
	// trigger the envelopes attack and release "8t" apart
	//ampEnv.triggerAttackRelease("8t");
}