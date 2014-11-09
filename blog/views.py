# -*- coding: utf-8 -*- 

from datetime import datetime
import logging

from django.shortcuts import render_to_response
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from blog.utils.log import logger


def test(reqeust, *args, **kwargs):
    """ this is a test handler """
    logger.info("i am a log info")
    print "print test"
    context = {'now_time': datetime.now()}
    return render_to_response('test.html', context)
