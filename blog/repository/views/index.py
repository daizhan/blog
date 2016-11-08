# -*- coding: utf-8 -*- 

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.core.urlresolvers import reverse

from blog.repository.models import Stuff, StaticPage

from blog.base_handler import BaseView
from blog.const.choices import StatusType, VerifyType, StuffType


class Disclaimer(BaseView):

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(reverse('index'))


class RepositoryIndex(BaseView):

    def get(self, request):
        stuff_list = Stuff.objects.filter(
            status=StatusType.normal, verify=VerifyType.verify_success
        )
        return self.render(
            request, "repository/index.html",
            data={"stuff_list": stuff_list}
        )


class RepositoryStuff(BaseView):

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(reverse('index'))


class RepositoryProjects(BaseView):

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(reverse('index'))


class RepositoryTemplates(BaseView):

    def get(self, request):
        stuff_list = Stuff.objects.filter(
            type=StuffType.static_page, status=StatusType.normal,
            verify=VerifyType.verify_success
        )
        return self.render(
            request, "repository/static_page/list.html",
            data={"stuff_list": stuff_list}
        )


class RepositoryTemplateContent(BaseView):

    def __init__(self, **kwargs):
        super(RepositoryTemplateContent, self).__init__()
        self.initial()

    def initial(self):
        self.stuff_type = StuffType.static_page

    def get(self, request, slug, url_code='index'):
        stuff_list = Stuff.objects.filter(
            slug=slug, type=self.stuff_type, status=StatusType.normal,
            verify=VerifyType.verify_success
        )[:1]
        if not stuff_list:
            raise Http404("stuff not found")
        stuff = stuff_list[0]
        static_pages = StaticPage.objects.filter(
            url_code=url_code, stuff_id=stuff.id, status=StatusType.normal,
            verify=VerifyType.verify_success
        )[:1]
        if not static_pages:
            raise Http404("static page not found")
        static_page = static_pages[0]
        return self.render(
            request, static_page.template,
            data={"stuff": stuff, 'static_page': static_page}
        )


class RepositoryExercises(BaseView):

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(reverse('index'))


class RepositoryExerciseContent(RepositoryTemplateContent):

    def initial(self):
        self.stuff_type = StuffType.exercise
