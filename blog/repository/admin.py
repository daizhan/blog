# -*- coding: utf-8 -*-

from django.contrib import admin

import models
from blog.management.models import SEORecord
from blog.utils.models import img_thumb, get_create_time
from blog.repository.forms import StaticPageAdminForm
from blog.const.choices import StuffType


class TagAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['slug', 'name', 'desc', img_thumb, 'count',
                    'status', get_create_time]
    list_filter = ['status']
    search_fields = ['name', 'desc']

admin.site.register(models.Tag, TagAdmin)


class StuffAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = [
        'slug', 'name', 'desc', img_thumb, 'type', 'access_count', 
        'comment_count', 'good_count', 'verify', 'status', get_create_time
    ]
    raw_id_fields = ['tags']
    list_filter = ['type', 'verify', 'status']
    search_fields = ['name', 'desc']


admin.site.register(models.Stuff, StuffAdmin)


class StaticPageAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = [
        'stuff', 'label', 'url_code', 'desc', 'template',
        'verify', 'status', get_create_time
    ]
    raw_id_fields = ['stuff']
    list_filter = ['verify', 'status']
    search_fields = ['label', 'desc']

    form = StaticPageAdminForm

    def save_model(self, request, obj, form, change):
        obj.save()
        if not change: # 首次创建插入seo信息
            url_name_dict = {
                StuffType.static_page: 'repository_template_content',
                StuffType.exercise: 'repository_exercise_content',
            }
            stuff_type = obj.stuff.type
            values = obj.stuff.slug
            if stuff_type == StuffType.static_page:
                values += "," + obj.url_code
            seo = SEORecord(url_name=url_name_dict[obj.stuff.type],
                            values=values, title=obj.label)
            seo.save()

admin.site.register(models.StaticPage, StaticPageAdmin)


class CommentAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['slug', 'content', 'user', 'stuff', 'status', get_create_time]
    list_filter = ['status']
    search_fields = ['content']

admin.site.register(models.Comment, CommentAdmin)


class ReplyAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['slug', 'content', 'user', 'to_reply', 'comment',
                    'status', get_create_time]
    list_filter = ['status']
    search_fields = ['content']

admin.site.register(models.Reply, ReplyAdmin)
