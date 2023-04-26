import React from 'react';
import {motion} from 'framer-motion/dist/framer-motion'
// import * as Tone from "tone";
// // Create a new synth instance with default settings
// const synth = new Tone.Synth().toDestination();
// // Trigger a C4 note for 1 second
// synth.triggerAttackRelease("C4", "1");
// // Create a new FFT instance with 1024 frequency bins
// const fft = new Tone.FFT(1024);
// // Connect the synth output to the FFT analyzer input
// synth.connect(fft);
// Log the FFT analysis to the console every 100ms
// setInterval(() => {
//   console.log(fft.getValue());
// }, 100);

const Home = () => {
  return (
    <motion.div initial={{opacity:0}} animate = {{opacity: 1}} exit={{opacity:0}}>
      <h1>This is the homepage.</h1>;
    </motion.div>
    )
};

export default Home;