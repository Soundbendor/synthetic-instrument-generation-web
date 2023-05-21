# Front-End

Our front end is built in React. The index.html is within ```./public/``` which creates the root element in ```./src/index.js``` to build the whole web application, which is essentially all within ```./src/pages/Sig.js```. Essentially the whole application is embedded within the buttons PlayButton and VoteButton. Both of these use axios to make HTTP requests to our Flask API. All components can be found within ```./src/pages/components ```

## Sound Generation

All sounds are synthesized via the Tone.js library. Each individual harmonic is created separately with independent ADSR volume envelopes. This is all within ```.src/pages/components/PlayButton.js```, in the functions 

```synthesizeInstrument(sound_id, harms, attack, decay, sustain, release, mul)``` 
- ```sound_id:``` The id of the sound being created.
- ```harms:``` an array of the harmonics to create instrument.
- ```attack:``` an array of attack lengths for each harmonic.
- ```decay:``` an array of decay lengths for each harmonic.
- ```sustain:``` an array of sustain lengths for each harmonic.
- ```release:``` an array of release lengths for each harmonic.
- ```mul:``` an array of multipliers or velocities for each harmonic.

```singleFrequency(poly, analyser, frequency, attack, decay, sustain, release, mul)```
Called from synthesizeInstrument and passed single values from arrays at a time to create each individual harmonic.
- ```poly:``` used to play each individual harmonic.
- ```analyser:``` used for analyzing instrument frequency content.
- ```frequency, attack, decay, sustain, release, mul:``` individual values from previous arrays to synthesize one by one.

# Back End / API
The back-end is written in Python using the Flask framework to create our API which connects to our MYSQL amazon RDS database. It consists of various endpoints such as

- ```/retrieve_member``` grabs a random instrument JSON object from the current generation from the database.

- ```/vote``` triggered by VoteButton to vote for that instrument, gets passed ```chromosomeID``` as the winners ID, ```opponentChromosomeID``` as the losers ID, ```ip```, and ```location``` then inserts the vote information into the database including datetime of the vote.

- ```/next_gen``` admin function to skip to the next generation.

- ```/clearDB``` admin function to clear the entire database. Currently this is ran each time that the api is loaded. Comment out all initial startup code to remove this functionality.

## MYSQL Database

All of the MYSQL login information is held within the environment variables defined within the dockerfile found within ```./src/backend/dockerfile```.

# Useful Resources
[<span style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; border-radius: 4px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; cursor: pointer;">Tone.js Docs</span>](https://tonejs.github.io/docs/14.7.77/index.html)

[<span style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; border-radius: 4px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; cursor: pointer;">Flask Docs</span>](https://flask.palletsprojects.com/en/2.3.x/)

# Running locally

## Front End:
Run the command to install dependencies.

``` npm install ```

## API:
Run this command to install Flask and other dependencies for the API.

``` pip install -r requirements.txt ```


From the back-end folder start the api server.

``` python api.py ```

# Running on AWS
First you must ensure that you have configured your credentials for your AWS account. This can be done manually by placing them within ```C:/Users/<Your_User>/.aws/credentials```.

## S3
First we must build the React project using

```npm run build```

once the project is built you can simply just upload this into the S3 bucket named ```sig-bucket```.

## Lightsail
We containerize the back-end using docker and push the latest image to the AWS lightsail service with the following commands from the back-end folder.

```docker build -t sig-api .```

```aws lightsail push-container-image --service-name sig-api --label sig-api --image sig-api```
