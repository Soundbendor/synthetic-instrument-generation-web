import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bird from "../video/bird.webm"

import VoteButton from './Components/VoteButton'
import PlayButton from './Components/PlayButton'
// import AdminPanel from './Components/AdminPanel';

const Sig = () => {
  // console.clear();
  return (
    <AudioPlayers/>
  )
};

export default Sig;

function RandomizeColors() {
  // Select all voteBox elements
  const voteBoxes = document.querySelectorAll('.voteBox');

  // Iterate over each voteBox and set a random background color
  voteBoxes.forEach((voteBox) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hexadecimal color code
    voteBox.style.backgroundColor = `#${randomColor}`; // Set the background color of the current voteBox to the generated color
    });
}


function AudioPlayers() {
  const [ip, setIP] = useState(0)
  const [location, setLocation] = useState(0)
  const [instrument_1, setInstrument_1] = useState(null)
  const [instrument_2, setInstrument_2] = useState(null)
  const [isLoading_1, setIsLoading_1] = useState(false)
  const [isLoading_2, setIsLoading_2] = useState(false)

  const ipApiKey = 'abe1a825ca4c4a7b83a74c4486f4ace1';

  useEffect(() => {
    axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${ipApiKey}`)
    .then(response => {
      setIP(response.data.ip_address)
      setLocation(response.data.city)
      getInstrument_1()
      getInstrument_2()
    })
    .catch(error => {
      console.log(error);
  })

   // Select all voteBox elements
   const voteBoxes = document.querySelectorAll('.voteBox');

   // Iterate over each voteBox and set a random background color
   voteBoxes.forEach((voteBox) => {
     const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hexadecimal color code
     voteBox.style.backgroundColor = `#${randomColor}`; // Set the background color of the current voteBox to the generated color
    });
    }, [])

  // Function to get sounds
  async function getInstrument_1() {
    const api_url = 'https://sig-api.9s7d9oh6r2mg0.us-east-1.cs.amazonlightsail.com';
    // const api_url = 'http://127.0.0.1:5000';
    setIsLoading_1(true)
    axios({
      method: "GET",
      url:`${api_url}/retrieve_member`,
    }).then((response) => {
      const res = response.data
      console.log(res)
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
    const api_url = 'https://sig-api.9s7d9oh6r2mg0.us-east-1.cs.amazonlightsail.com';
    // const api_url = 'http://127.0.0.1:5000';
    setIsLoading_2(true)
    axios({
      method: "GET",
      url:`${api_url}/retrieve_member`,
    })
    .then((response) => {
      const res = response.data
      console.log(res)
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
      <h1>Synthetic Instrument Generation</h1>
      <div style={{ zIndex: "-5", display: "flex", justifyContent: "center", width: "100%", margin: "0", minHeight: "100%", height: "100%" }}>
          <div className="voteBox" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="voteElements">
              <video className="videoPlayer" width="320" height="240" autoPlay muted>
                <source src={bird} type="video/webm" /> Your browser does not support the video tag.
              </video>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <PlayButton id = {1} loading = {isLoading_1} instrument = {instrument_1} />
                <VoteButton id = {1}
                  onClick={() => {
                    getInstrument_1();
                    getInstrument_2();
                    RandomizeColors();
                  }}
                  loading={isLoading_1}
                  instrument={instrument_1}
                  opponent={instrument_2}
                  ip={ip}
                  location={location}
                />
              </div>
            </div>
          </div>

          <div className="voteBox" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="voteElements">
              <video className="videoPlayer" width="320" height="240" autoPlay muted>
                <source src={bird} type="video/webm" /> Your browser does not support the video tag.
              </video>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <PlayButton id = {2} loading={isLoading_2} instrument={instrument_2} />
                <VoteButton id = {2}
                  onClick={() => {
                    getInstrument_1();
                    getInstrument_2();
                    RandomizeColors();
                  }}
                  loading={isLoading_2}
                  instrument={instrument_2}
                  opponent={instrument_1}
                  ip={ip}
                  location={location}
                />
              </div>
            </div>
          </div>
        </div>
      {/* <AdminPanel/> */}
    </div>
  )
}