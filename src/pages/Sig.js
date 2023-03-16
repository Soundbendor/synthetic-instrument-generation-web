import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion/dist/framer-motion'
import axios from 'axios';
import bird from "../video/bird.webm"

import VoteButton from './Components/VoteButton'
import PlayButton from './Components/PlayButton'
import AdminPanel from './Components/AdminPanel';

const Sig = () => {
  console.clear();
  return (
    <AudioPlayers/>
  )
};

export default Sig;

function AudioPlayers() {
  const [ip, setIP] = useState(0)
  const [location, setLocation] = useState(0)
  const [instrument_1, setInstrument_1] = useState(null)
  const [instrument_2, setInstrument_2] = useState(null)
  const [isLoading_1, setIsLoading_1] = useState(false)
  const [isLoading_2, setIsLoading_2] = useState(false)

  useEffect(() => {
    axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=abe1a825ca4c4a7b83a74c4486f4ace1')
    .then(response => {
      setIP(response.data.ip_address)
      setLocation(response.data.city)
      getInstrument_1()
      getInstrument_2()
    })
    .catch(error => {
      console.log(error);
  })}, [])

  // Function to get sounds
  async function getInstrument_1() {
    setIsLoading_1(true)
    axios({
      method: "GET",
      url:"/retrieve_member",
    })
    .then((response) => {
      const res = response.data
      setInstrument_1(res)
      setIsLoading_1(false)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
  }
  
  async function getInstrument_2() {
    setIsLoading_2(true)
    axios({
      method: "GET",
      url:"/retrieve_member",
    })
    .then((response) => {
    const res = response.data
      setInstrument_2(res)
      setIsLoading_2(false)
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
          <PlayButton loading = {isLoading_1} instrument = {instrument_1}/>
          <VoteButton onClick = {() => {
              getInstrument_1()
              getInstrument_2()
            }} loading = {isLoading_1} instrument = {instrument_1} opponent = {instrument_2}ip = {ip} location = {location} />
          <a href = 'google.com' className = "downloadLink" id = "downloadLink1"> </a>
        </div>
        <div className = "voteBox, horizontal-center">
        <video className = "videoPlayer" width="320" height="240" autoPlay muted>
          <source src={bird} type="video/webm"/>
        Your browser does not support the video tag.
        </video>
            <PlayButton onClick = {() => {
            }} loading = {isLoading_2} instrument = {instrument_2}/>
            <VoteButton onClick = {() => {
              getInstrument_1()
              getInstrument_2()
            }} loading = {isLoading_2} instrument = {instrument_2} opponent = {instrument_1} ip = {ip} location = {location} />
          <a href = 'google.com' className = "downloadLink" id = "downloadLink2"> </a>
        </div>
      </div>
      <AdminPanel/>
    </div>
  )
}