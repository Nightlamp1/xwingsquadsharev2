from django.shortcuts import render

# Create your views here.
def builder(request):
    return render(request,'builder/builder.html')
