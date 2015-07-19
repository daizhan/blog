# -*- coding: utf-8 -*- 

from datetime import datetime
import logging

from django.shortcuts import render_to_response
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from blog.utils.log import logger


def index(reqeust, *args, **kwargs):
    return render_to_response('index.html')


def test(reqeust, *args, **kwargs):
    context = {'now_time': datetime.now()}
    return render_to_response('test.html', context)


def wangkui(reqeust, *args, **kwargs):
    return render_to_response('wangkui.html')


def wix_stunning(reqeust, *args, **kwargs):
    return render_to_response('wix_stunning.html')


def wix_petshop_index(reqeust, *args, **kwargs):
    return render_to_response('wix_petshop/index.html', {'nav_pos': 'home'})


def wix_petshop_mart(reqeust, *args, **kwargs):
    return render_to_response('wix_petshop/mart.html', {'nav_pos': 'mart'})


def wix_petshop_aboutus(reqeust, *args, **kwargs):
    return render_to_response('wix_petshop/aboutus.html', {'nav_pos': 'aboutus'})


def wix_petshop_blog(reqeust, *args, **kwargs):
    return render_to_response('wix_petshop/blog.html', {'nav_pos': 'blog'})


def wix_petshop_guide(reqeust, *args, **kwargs):
    return render_to_response('wix_petshop/guide.html', {'nav_pos': 'guide'})


def wix_petshop_contact(reqeust, *args, **kwargs):
    return render_to_response('wix_petshop/contact.html', {'nav_pos': 'contact'})
