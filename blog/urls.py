# -*- coding: utf-8 -*-

from django.conf.urls import include, url
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

from . import views

from blog.settings import DEBUG

admin.autodiscover()

urlpatterns = [
    # Examples:
    # url(r'^$', 'blog.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', views.index, name="index"),

    url(r'^repository/', include('blog.repository.urls')),

    url(r'^test/$', views.test, name="test"),
]

if DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


handler400 = 'blog.base_handler.bad_request'
handler403 = 'blog.base_handler.permission_denied'
handler404 = 'blog.base_handler.page_not_found'
handler500 = 'blog.base_handler.server_error'
