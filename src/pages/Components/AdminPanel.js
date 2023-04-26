import React, {useState, useEffect} from 'react';
import axios from 'axios';

function NextGenButton(props) {
    const [disabled, setDisabled] = useState(false)

    async function nextGen() {
        const api_url = process.env.API_URL;
        setDisabled(false)
        axios({
        method: "GET",
        url:`${api_url}/next_gen`,
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

    return <button disabled = {disabled} onClick = {() => {
        nextGen()
    }} className = "voteButton">Next Generation</button>
}

function ClearDatabaseButton(props) {
    const [disabled, setDisabled] = useState(false)

    async function nextGen() {
        const api_url = process.env.API_URL;
        setDisabled(false)
        axios({
        method: "GET",
        url:`${api_url}/clearDB`,
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

    return <button disabled = {disabled} onClick = {() => {
        console.log("test")
        nextGen()
    }} className = "voteButton">Clear DB</button>
}

function AdminPanel(props) {
    return (
        <>
            <div>
                <NextGenButton/>
                <ClearDatabaseButton/>
            </div>
        </>
    )
}

export default AdminPanel
