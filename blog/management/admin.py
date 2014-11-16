# -*- coding: utf-8 -*-

from django.contrib import admin

import models
from blog.utils.models import avatar_thumb


class UserAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ['nickname', 'email', 'password', avatar_thumb, 'gender', 'user_type', 'status', 'update_time', 'create_time']
    list_filter = ['gender', 'user_type', 'status']
    search_fields = ['nickname', 'email']

admin.site.register(models.User, UserAdmin)
