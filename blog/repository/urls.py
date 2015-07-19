# -*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url
from blog.repository.views.index import (
    RepositoryIndex, RepositoryStuff,
    RepositoryProjects, RepositoryExercises, RepositoryTemplates,
    RepositoryTemplateContent, RepositoryExerciseContent,
    Disclaimer
)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'blog.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', RepositoryIndex.as_view(), name="repository_index"),
    url(r'^stuff/?$', RepositoryStuff.as_view(), name="repository_stuff"),
    url(r'^projects/$', RepositoryProjects.as_view(), name="repository_projects"),
    url(r'^templates/$', RepositoryTemplates.as_view(), name="repository_templates"),
    url(r'^template/([0-9a-z]{8})/?$', RepositoryTemplateContent.as_view(), name="repository_template_index"),
    url(r'^template/([0-9a-z]{8})/([a-z/-_]{2,30})/?$', RepositoryTemplateContent.as_view(), name="repository_template_content"),
    url(r'^exercises/$', RepositoryExercises.as_view(), name="repository_exercises"),
    url(r'^exercise/([0-9a-z]{8})/?$', RepositoryExerciseContent.as_view(), name="repository_exercise_content"),
    url(r'^disclaimer/?$', Disclaimer.as_view(), name="disclaimer"),

    # url(r'^wangkui/$', 'blog.views.wangkui', name="wangkui"),
    # url(r'^wix/stunning/$', 'blog.views.wix_stunning', name="wix-stunning"),
    # url(r'^wix/petshop/index/$', 'blog.views.wix_petshop_index', name="wix-petshop-index"),
    # url(r'^wix/petshop/mart/$', 'blog.views.wix_petshop_mart', name="wix-petshop-mart"),
    # url(r'^wix/petshop/aboutus/$', 'blog.views.wix_petshop_aboutus', name="wix-petshop-aboutus"),
    # url(r'^wix/petshop/blog/$', 'blog.views.wix_petshop_blog', name="wix-petshop-blog"),
    # url(r'^wix/petshop/guide/$', 'blog.views.wix_petshop_guide', name="wix-petshop-guide"),
    # url(r'^wix/petshop/contact/$', 'blog.views.wix_petshop_contact', name="wix-petshop-contact"),
)
