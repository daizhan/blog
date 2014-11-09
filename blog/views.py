# -*- coding: utf-8 -*- 

from datetime import datetime

from django.shortcuts import render_to_response
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect


def test(reqeust, *args, **kwargs):
    """ this is a test handler """
    context = {'now_time': datetime.now()}
    return render_to_response('test.html', context)
