import React from 'react';
import {motion} from 'framer-motion/dist/framer-motion'
import * as Tone from 'tone'

const Home = () => {
  // const poly = new Tone.PolySynth().toDestination();
  // poly.set({
  //   "envelope" : {
  //     "attack": 0.1,
  //     "decay": 0.1,
  //     "sustain": 0.2,
  //     "release": 0.1
  //   }
  // });
  // poly.triggerAttackRelease(220)
  // poly.set({
  //   "envelope" : {
  //     "attack": 0.3,
  //     "decay": 0.1,
  //     "sustain": 0.2,
  //     "release": 10
  //   }
  // });
  // poly.triggerAttackRelease(1000)

  return (
<motion.div initial={{opacity:0}} animate = {{opacity: 1}} exit={{opacity:0}}>
        <h1>This is the homepage.</h1>;
      </motion.div>
    )
  };
  
  export default Home;