from django.shortcuts import render
from django.conf import settings
import os
import json

# Create your views here.
def builder(request):
    pilots = open(os.path.join(settings.STATIC_ROOT,'xwing-data/data/pilots.js'))
    ships = open(os.path.join(settings.STATIC_ROOT,'xwing-data/data/ships.js'))
    upgrades = open(os.path.join(settings.STATIC_ROOT,'xwing-data/data/upgrades.js'))

    upgrades = json.load(upgrades)
    pilots = json.load(pilots)
    ships = json.load(ships)
    return render(request,'builder/builder.html',
                  {'pilots':json.dumps(pilots),
                   'ships':json.dumps(ships),
                   'upgrades':json.dumps(upgrades),
                   })
