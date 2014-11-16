# -*- coding: utf-8 -*-

from django.contrib import admin

import models
from blog.utils.models import img_thumb


class CategoryAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['name', 'desc', img_thumb, 'parent', 'status', 'create_time']
    list_filter = ['parent', 'status']
    search_fields = ['name', 'desc']

admin.site.register(models.Category, CategoryAdmin)


class TagAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['name', 'desc', img_thumb, 'status', 'create_time']
    list_filter = ['status']
    search_fields = ['name', 'desc']

admin.site.register(models.Tag, TagAdmin)


class StuffAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = [
        'name', 'desc', img_thumb, 'access_count', 'comment_count', 'star',
        'good_count', 'status', 'create_time'
    ]
    list_filter = ['status']
    search_fields = ['name', 'desc']

admin.site.register(models.Stuff, StuffAdmin)


class CommentAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['content', 'user', 'stuff', 'star',
                    'good_count', 'status', 'create_time']
    list_filter = ['status']
    search_fields = ['conent']

admin.site.register(models.Comment, CommentAdmin)


class ReplyAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['content', 'user', 'to_reply', 'comment', 'status', 'create_time']
    list_filter = ['status']
    search_fields = ['conent']

admin.site.register(models.Reply, ReplyAdmin)
