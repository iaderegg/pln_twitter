from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^$', views.index, name='index'),
    url(r'^tweet_processing/$', views.tweet_processing, name='tweet_processing'),
    url(r'^tweet_tokenizer/$', views.tweet_tokenizer, name='tweet_tokenizer'),
    url(r'^word_processing/$', views.word_processing, name='word_processing')
]