#from socket import fromshare
from django import forms
from django.forms import ModelForm
from home.models import rate

#This file store all the form 
#When needed, call this file when want to use form

class rateForm(forms.ModelForm):
    
    class Meta:
        model = rate
        fields = ('rates',)