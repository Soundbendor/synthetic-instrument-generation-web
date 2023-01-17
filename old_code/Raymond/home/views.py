from configparser import SectionProxy
from email.mime import audio
from ipaddress import ip_address
from operator import truediv
from re import template
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from .models import instrument, audio, rate
from .form import rateForm
from django.views.generic import View, TemplateView
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
import json
import logging
from django.core import serializers

# Create your views here.
# home page
def index(request):
    return render(request, "frontend/index.html")
# About Page
def about(request):
    return render(request, "frontend/about.html")



#class that handle json response from website(when the next button clicked, send a json request to get object from DB)
class PostJsonListView(View):
    def get(self, *args, **kwargs):
        # print(kwargs)
        #get two number from jsonrequest
        first = kwargs.get('first') 
        second = kwargs.get('second')
        #get audio object accrdoing to the variable pass in
        firstAudio = list(audio.objects.filter(instrumentId=first).values())
        secondAudio = list(audio.objects.filter(instrumentId=second).values())

        


        
        return JsonResponse({'firstAudio':firstAudio, 'secondAudio':secondAudio}, safe=False)


def survey(request):
        
    return render(request, "frontend/testView.html")



#a view that use to handle ajax submission
def submit(request):
    if request.method == 'POST':
        # getting ip address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        print("=== ip:" + ip)
        # getting data submit from ajax
        print("=== submit view recice submission")
        first = request.POST['first']
        second = request.POST['second']
        ids = request.POST['ids']
        print("=== first: " + first)
        print("=== second: " + second)
        print("=== selcted ids: " + ids)

        # create obejct for model
        if first == ids: #first got selected, create a rate object according to selection and save it
            rateSelected = rate.objects.create(instrumentID_id = first, ip_address = ip, rates = 1)
            rateNotSelected = rate.objects.create(instrumentID_id = second, ip_address = ip, rates = 0)
            rateSelected.save()
            rateNotSelected.save()
        else:
            rateSelected = rate.objects.create(instrumentID_id = second, ip_address = ip, rates = 1)
            rateNotSelected = rate.objects.create(instrumentID_id = first, ip_address = ip, rates = 0)
            rateSelected.save()
            rateNotSelected.save()
      


    else:
        print(" === submit view didn't recice submission")
    return HttpResponse()


#NEED TO DO
#Pass in a form according to the instrument number 


#Note

#save with git

#git add .
#git commit -am 'message here'
#git push


# source venv/bin/activate