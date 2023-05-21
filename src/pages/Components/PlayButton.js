import React, {useState} from 'react';
import * as Tone from 'tone'
import Spinner from './Spinner'

function PlayButton(props){
    const [disabled,setDisabled] = useState(false);

    // Assign values and play
    function singleFrequency(poly, analyser, frequency, attack, decay, sustain, release, mul) {
        const now = Tone.now()

        poly.set({
          "envelope" : 
          {
              "attack": attack,
              "decay": decay,
              "sustain": sustain,
              "release": release
          }
        })

        // 0.01 is how long the note is held for
        poly.triggerAttackRelease(frequency, 0.01, now, mul);

        // const fft = analyser.getValue();
        // console.log(fft)
    }
  
  function synthesizeInstrument(sound_id, harms, attack, decay, sustain, release, mul) {
    // Create synth and connect to recorder / distortion
    const poly = new Tone.PolySynth();
    const recorder = new Tone.Recorder();
    const analyser = new Tone.FFT(2048);
    const distortion = new Tone.WaveShaper(
      (val) => val, 2048).toDestination();
    poly.connect(analyser);
    poly.connect(distortion);
    poly.connect(recorder);
    recorder.start();
  
    // Create n frequencies and pass their values
    for (let i = 0; i < 10; i++) {
      singleFrequency(
        poly, 
        analyser,
        harms[i] * 220, 
        attack[i], 
        decay[i], 
        sustain[i], 
        release[i],
        mul[i]
      )
    }
  
    // Once done recorded, setup download link
    setTimeout(async () => {
      // const recording = await recorder.stop();
      // const url = URL.createObjectURL(recording);
      
      // // Create a download link
      // const downloadLink = document.createElement('a');
      // downloadLink.href = url;
      // downloadLink.download = `Instrument_${sound_id}.wav`; // Set the desired filename for the download
      
      // // Add the link to the document
      // document.body.appendChild(downloadLink);
      
      // // Simulate a click on the download link
      // downloadLink.click();
      
      // // Remove the download link from the document
      // document.body.removeChild(downloadLink);
    }, 4000)
  }
    return (
        <>
            <div>
                {props.loading ? <Spinner/> : <button disabled = {disabled} className = "voteButton" onClick={() => {
                setDisabled(true)
                console.log("Playing ID: ", props.instrument.chromosomeID)
                setTimeout(async ()=> {
                  synthesizeInstrument(props.instrument.chromosomeID, 
                                      props.instrument.harms, 
                                      props.instrument.attacks, 
                                      props.instrument.decays, 
                                      props.instrument.sustains, 
                                      props.instrument.releases, 
                                      props.instrument.amps)
                  setDisabled(false)
                }, 250)

                }}>Play Sound {props.id}</button>}
            </div>
        </>
    )
}

export default PlayButton