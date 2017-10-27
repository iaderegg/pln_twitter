from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^$', views.index, name='index'),
    url(r'^tweet_processing/$', views.tweet_processing, name='tweet_processing'),
]