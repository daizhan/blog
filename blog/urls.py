# -*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

from blog.settings import DEBUG

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'blog.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', 'blog.views.test', name="test"),
    url(r'^wangkui/$', 'blog.views.wangkui', name="wangkui"),
    url(r'^wix/stunning/$', 'blog.views.wix_stunning', name="wix-stunning"),
    url(r'^wix/petshop/index/$', 'blog.views.wix_petshop_index', name="wix-petshop-index"),
    url(r'^wix/petshop/mart/$', 'blog.views.wix_petshop_mart', name="wix-petshop-mart"),
    url(r'^wix/petshop/aboutus/$', 'blog.views.wix_petshop_aboutus', name="wix-petshop-aboutus"),
    url(r'^wix/petshop/blog/$', 'blog.views.wix_petshop_blog', name="wix-petshop-blog"),
    url(r'^wix/petshop/guide/$', 'blog.views.wix_petshop_guide', name="wix-petshop-guide"),
    url(r'^wix/petshop/contact/$', 'blog.views.wix_petshop_contact', name="wix-petshop-contact"),
)

if DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


