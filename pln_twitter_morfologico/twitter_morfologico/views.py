# -*- coding: utf-8 -*-
#from __future__ import unicode_literals

from django.utils.encoding import python_2_unicode_compatible
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
from nltk.tokenize import TweetTokenizer

import commands

def index(request):
    template = loader.get_template('twitter_morfologico/index.html')
    context = {
        'mensaje': 'Probando Twitter Morfológico'
    }
    return render(request, 'twitter_morfologico/index.html', context)

def tweet_processing(request):
    tweet = request.POST.get('tweet_msg')

    tknzr = TweetTokenizer()

    result = tknzr.tokenize(tweet)
    result_morfo = []

    for w in result:
        print('echo "'+ w +'" | analyze \\xe2\\x80\\x93 analyze -f /usr/share/freeling/config/es.cfg')
        result_morfo.append(commands.getoutput('echo \''+ w +'\' | analyze \\xe2\\x80\\x93 analyze -f /usr/share/freeling/config/es.cfg'))

    data = {
        'result': result,
        'tweet_msg': tweet,
        'result_morfo': result_morfo
    }
    return JsonResponse(data)