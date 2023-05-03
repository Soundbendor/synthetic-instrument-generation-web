import React, { useState } from 'react';
import Spinner from './Spinner'
import axios from 'axios';

function VoteButton(props) {
    // Disables button to stop user from spamming buttons
    const [disabled,setDisabled] = useState(false);
    // Sends SQL update to vote count for chromosome
    async function vote(chromosomeID, opponentID, ip, location) {
        const api_url = process.env.API_URL || 'http://localhost:5000';
        setDisabled(true)
        axios({
        method: "GET",
        url:`${api_url}/vote`,
        params: {chromosomeID, opponentID, ip, location}
        })
        .then((response) => {
        // const res = response.data
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