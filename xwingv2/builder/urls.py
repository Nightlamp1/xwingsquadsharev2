from django.conf.urls import include, url
from django.contrib import admin
from builder import views

urlpatterns = [
    url(r'^builder/$', views.builder, name = 'builder'),
]
