# -*- coding: utf-8 -*-

from datetime import datetime
import logging

from django.shortcuts import render_to_response
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect

from django.core.urlresolvers import reverse

from blog.utils.log import logger


def index(reqeust, *args, **kwargs):
    return HttpResponseRedirect(reverse('repository_index'))


def test(reqeust, *args, **kwargs):
    context = {'now_time': datetime.now()}
    return render_to_response('test.html', context)
