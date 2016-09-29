from django.shortcuts import render
from django.conf import settings
import os
import json

# Create your views here.
def home(request):
    return render(request,'viewer/home.html')

def viewer(request):
    pilots = open(os.path.join(settings.STATIC_ROOT,'xwing-data/data/pilots.js'))
    pilots = json.load(pilots)
    return render(request,'viewer/viewer.html', {'pilots':json.dumps(pilots)})
