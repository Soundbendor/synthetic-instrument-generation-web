import React, { useState } from 'react';
import Spinner from './Spinner'
import axios from 'axios';

function VoteButton(props) {
    // Disables button to stop user from spamming buttons
    const [disabled,setDisabled] = useState(false);
    // Sends SQL update to vote count for chromosome
    async function vote(chromosomeID, ip, location) {
        setDisabled(true)
        axios({
        method: "GET",
        url:"/vote",
        params: {chromosomeID, ip, location}
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
          {props.loading ? <Spinner/> : <button disabled = {disabled} className = "voteButton" onClick={() => {
            vote(props.instrument.chromosomeID, props.ip, props.location)
            window.location.reload(false)
            }}>Vote 1</button>}
        </>
    )
}

export default VoteButton;