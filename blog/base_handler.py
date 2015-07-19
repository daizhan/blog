# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View

from blog.settings import DEBUG


class BaseView(View):

    def get_seo_data(self, request):
        return {
            'title': '',
            'keywords': '',
            'description': ''
        }

    def get_common_data(self, request):
        data = {
            "DEBUG": DEBUG
        }
        data['seo'] = self.get_seo_data(request)
        return data

    def render(self, request, template, data={}):
        context = self.get_common_data(request)
        if data:
            context.update(data)
        return render(request, template, context)


def page_not_found(request, *args, **kwargs):
    return render(request, 'http_status_error.html', context={"status": 404})


def server_error(request, *args, **kwargs):
    return render(request, 'http_status_error.html', context={"status": 500})


def permission_denied(request, *args, **kwargs):
    return render(request, 'http_status_error.html', context={"status": 404})


def bad_request(request, *args, **kwargs):
    return render(request, 'http_status_error.html', context={"status": 400})

