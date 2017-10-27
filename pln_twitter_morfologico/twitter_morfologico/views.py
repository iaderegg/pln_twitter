# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse

def index(request):
    template = loader.get_template('twitter_morfologico/index.html')
    context = {
        'mensaje': 'Probando Twitter Morfológico'
    }
    return render(request, 'twitter_morfologico/index.html', context)

def tweet_processing(request):
    tweet = request.POST.get('tweet_msg')
    data = {
        'result': 'Si retorna algo',
        'tweet_msg': tweet
    }
    return JsonResponse(data)