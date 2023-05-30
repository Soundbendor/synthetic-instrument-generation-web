import React, { useState } from 'react';
import Spinner from './Spinner'
import axios from 'axios';

function VoteButton(props) {
    // Disables button to stop user from spamming buttons
    const [disabled,setDisabled] = useState(false);
    // Sends SQL update to vote count for chromosome
    async function vote(chromosomeID, opponentID, ip, location) {
    const api_url = 'https://sig-api.9s7d9oh6r2mg0.us-east-1.cs.amazonlightsail.com';
    // const api_url = 'http://127.0.0.1:5000';
        setDisabled(true)
        axios({
            method: "POST",
            url:`${api_url}/vote`,
            params: {chromosomeID, opponentID, ip, location}
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
        setDisabled(false)
    }
    return (
        <>
        <div onClick={props.onClick}>
            {props.loading ? <Spinner/> : <button disabled = {disabled} className = "voteButton" onClick={() => {
                setDisabled(true)
                setTimeout(async ()=> {
                    vote(props.instrument.chromosomeID, props.opponent.chromosomeID, props.ip, props.location)
                setDisabled(false)
            }, 250)
                }}>Vote Sound {props.id}</button>}
        </div>
        </>
    )
}

export default VoteButton;