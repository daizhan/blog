# -*- coding: utf-8 -*-

from django.contrib import admin

import models
from forms import UserAdminForm, SEOAdminForm
from blog.utils.models import (
    avatar_thumb, get_update_time, get_create_time, generate_url
)


class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_per_page = 20
    list_display = ['nickname', 'email', 'password', avatar_thumb, 'gender',
                    'user_type', 'status', get_update_time, get_create_time]
    list_filter = ['gender', 'user_type', 'status']
    search_fields = ['nickname', 'email']

admin.site.register(models.User, UserAdmin)


class SEORecordAdmin(admin.ModelAdmin):
    form = SEOAdminForm
    list_per_page = 20
    list_display = ['id', 'page_url', 'title', 'keywords', 'description',
                    'status', get_update_time, get_create_time]
    list_filter = ['url_name', 'status']
    search_fields = ['url_name', 'title', 'keywords']

    def page_url(self, obj):
        url = generate_url(obj.url_name, obj.values)
        if not url:
            return u"url名称和url值不匹配"
        else:
            return u"<a href='%s'>%s</a>" % (url, url)
    page_url.short_description = "页面链接"
    page_url.allow_tags = True 

admin.site.register(models.SEORecord, SEORecordAdmin)
