from django.contrib import admin
from .models import instrument, audio, rate
# Register your models here.

# Registered model thath help managed the databse tabel
admin.site.register(instrument)
admin.site.register(audio)
admin.site.register(rate)