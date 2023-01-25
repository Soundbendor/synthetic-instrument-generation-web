from flask import Flask, Response
from pyo import *
import os

api = Flask(__name__)

# Either do a random query on 2 sounds, or gain this from the GA
@api.route("/sound_generation")
def soundGeneration():
    sound_1 = "https://cdn.freesound.org/previews/321/321029_5123851-lq.mp3"
    sound_2 = "https://cdn.freesound.org/previews/321/321029_5123851-lq.mp3"
    
    ser = Server(sr=16000, audio='offline').boot()

    file_path = "./"

    path = os.path.join(file_path, "./sounds", "sound_1.wav")
    ser.recordOptions(dur=5, filename=path, fileformat=0, sampletype=1 )

    envsL = 0
    envsR = 0
    sinesL = [200, 400, 600]
    sinesR = 0

    # Generate a single sound
    ser.recstart()
    
    envsL = Adsr(attack = 0.5, decay = 0.5, sustain = 0.5, release = 0.5, dur = 5)
    envsR = Adsr(attack = 0.5, decay = 0.5, sustain = 0.5, release = 0.5, dur = 5)
    sinesL = Sine(freq = 220, mul = envsL * 1)
    sinesR = Sine(freq = 220, mul = envsR * 1)
    sinesL.out(0)
    sinesR.out(1)
    envsL.play()
    envsR.play()
    ser.recstop()
    ser.start()
    ser.shutdown()

    response_body = {
        "sound_1": sound_1,
        "sound_2": sound_2
    }
    return response_body
    
    
    
    
    
    
    
    
    
    
    
    
    # # Boot up server to play and record sound
    # # TEST change sampling rate to lower, default is 44100
    # ser = Server(sr=16000, audio='offline').boot()
    
    # #i think I should actually change this?? actually never mind, directory represents the specific folder in this case but they can be in any order
    # file_path = ".\sounds"

    # # Includes the absolute filepath, the specific folder and the new file name
    # path = os.path.join(file_path, directory, filename)
    # ser.recordOptions(dur=5, filename=path, fileformat=0, sampletype=1 )

    # # Create empty arrays that will be filled out using passed in parameters
    # envsL = [0] * num
    # envsR = [0] * num
    # sinesL = [0] * num
    # sinesR = [0] * num

    # # Begins recording to generate wav file
    # ser.recstart()
    
    # # Create ADSR envelope and Sine wave that will be played and recorded
    # for n in range(num):
    #     envsL[n] = Adsr(attack = a[n], decay = d[n], sustain = s[n], release = r[n], dur = 5)
    #     envsR[n] = Adsr(attack = a[n], decay = d[n], sustain = s[n], release = r[n], dur = 5)
    #     sinesL[n] = Sine(freq = harms[n], mul = envsL[n] * amps[n])
    #     sinesR[n] = Sine(freq = harms[n], mul = envsR[n] * amps[n])
    #     sinesL[n].out(0)
    #     sinesR[n].out(1)
    #     envsL[n].play()
    #     envsR[n].play()

    # # Stops recording
    # ser.recstop()

    # ser.start()

    # # Shuts down the server 
    # ser.shutdown()
    
    # return ""
    
    