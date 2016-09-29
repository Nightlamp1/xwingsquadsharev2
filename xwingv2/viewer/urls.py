from django.conf.urls import include, url
from django.contrib import admin
from viewer import views

urlpatterns = [
    # Examples:
    # url(r'^$', 'xwingv2.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', views.home, name = 'home'),
    url(r'^viewer/$', views.viewer, name = 'viewer'),
]
