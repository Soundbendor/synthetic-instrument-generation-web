import React from 'react';
import Animal from "react-animals";

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
        <div>
            <div className = "voteBox, horizontal-center">
                <Animal dance />
                <audio controls>
                    <source src="https://cdn.freesound.org/previews/321/321029_5123851-lq.mp3" type="audio/mp3"/>
                    Your browser does not support the audio element.
                </audio>
                <button className = "voteButton" onClick = {vote1}>Vote 1</button>
            </div>

            <div className = "voteBox, horizontal-center ">
                <Animal dance />
                <audio controls>
                    <source src="https://cdn.freesound.org/previews/321/321029_5123851-lq.mp3" type="audio/mp3"/>
                    Your browser does not support the audio element.
                </audio>
                <button className = "voteButton" onClick = {vote2}>Vote 2</button>
            </div>
        </div>
    )
};
  
  export default Sig;