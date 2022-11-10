from ipaddress import ip_address
from pickle import TRUE
from django.db.models.deletion import CASCADE
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.forms import CharField
from datetime import datetime  

class instrument(models.Model):
    #id
    id = models.BigAutoField(primary_key=True)
    # #six gene for the formation of audio
    frequencies = ArrayField(models.FloatField(max_length=64), null=True, blank=True)
    amplitudes = ArrayField(models.FloatField(max_length=64), null=True, blank=True)
    attack = ArrayField(models.FloatField(max_length=64), null=True, blank=True)
    decay = ArrayField(models.FloatField(max_length=64), null=True, blank=True)
    sustain =ArrayField(models.FloatField(max_length=64), null=True, blank=True)
    release = ArrayField(models.FloatField(max_length=64), null=True, blank=True)
    # #addtional infor
    generation_number = models.IntegerField(default=0, )
    prescore = models.FloatField(default=0,)
    
class audio(models.Model):
    instrumentId = models.OneToOneField(instrument, on_delete=models.CASCADE, primary_key=True)
    location = models.FileField()


class rate(models.Model):
    id = models.BigAutoField(primary_key=True)
    instrumentID = models.ForeignKey(instrument, on_delete=models.CASCADE, default=1)
    time = models.DateTimeField(auto_now_add = True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    rates =  models.IntegerField(default=0, )
    #create a functin for easy model create
    