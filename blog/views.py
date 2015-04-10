# -*- coding: utf-8 -*- 

from datetime import datetime
import logging

from django.shortcuts import render_to_response
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from blog.utils.log import logger


def test(reqeust, *args, **kwargs):
    context = {'now_time': datetime.now()}
    logger.info('logger info test')
    return render_to_response('test.html', context)

def wangkui(reqeust, *args, **kwargs):
    return render_to_response('wangkui.html')


def wix_stunning(reqeust, *args, **kwargs):
    return render_to_response('wix_stunning.html')
