# -*- coding: utf-8 -*-

from django.contrib import admin

import models
from forms import UserAdminForm
from blog.utils.models import avatar_thumb, get_update_time, get_create_time


class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_per_page = 20
    list_display = ['nickname', 'email', 'password', avatar_thumb, 'gender',
                    'user_type', 'status', get_update_time, get_create_time]
    list_filter = ['gender', 'user_type', 'status']
    search_fields = ['nickname', 'email']

admin.site.register(models.User, UserAdmin)
