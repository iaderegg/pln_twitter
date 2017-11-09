# -*- coding: utf-8 -*-
#from __future__ import unicode_literals

from django.utils.encoding import python_2_unicode_compatible
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
from nltk.tokenize import TweetTokenizer

import commands
#import freeling

def index(request):
    template = loader.get_template('twitter_morfologico/index.html')
    context = {
        'mensaje': 'Probando Twitter Morfológico'
    }
    return render(request, 'twitter_morfologico/index.html', context)

def tweet_tokenizer(request):
    tweet = request.POST.get('tweet_msg')
    tknzr = TweetTokenizer()

    tweet_tknzd = tknzr.tokenize(tweet)

    print(tweet_tknzd)

    data = {
        'tweet_msg': tweet,
        'result_tknzr': tweet_tknzd
    }

    return JsonResponse(data)


def word_processing(request):
    word = request.POST.get('word')
    result_freeling = commands.getoutput('echo \''+ word +'\' | analyze \\xe2\\x80\\x93 analyze -f /usr/local/share/freeling/config/es.cfg')
    result = {
        'word_analysis': result_freeling,
        'word': word
    }
    return JsonResponse(result)

def tweet_processing(request):
    tweet = request.POST.get('tweet_msg')

    #tknzr = TweetTokenizer()

    #result = tknzr.tokenize(tweet)
    result_morfo = []

    for w in result:
        #print(w.get_form()+" "+w.get_lemma()+" "+w.get_tag()+" "+w.get_senses_string())
        print('echo "'+ w +'" | analyze \\xe2\\x80\\x93 analyze -f /usr/local/share/freeling/config/es.cfg')
        result_morfo.append(commands.getoutput('echo \''+ w +'\' | analyze \\xe2\\x80\\x93 analyze -f /usr/local/share/freeling/config/es.cfg'))

    data = {
        'result': result,
        'tweet_msg': tweet,
        'result_morfo': result_morfo
    }
    return JsonResponse(data)