# -*- coding: utf-8 -*-

from django.db import models

from blog.utils.models import set_upload_path
from blog.const.choices import StatusType, GenderType, UserType


class User(models.Model):
    nickname = models.CharField("昵称", max_length=20)
    password = models.CharField("密码", max_length=50, default='', blank=True,
                                help_text="普通用户不需要密码，其他用户必须填写密码")
    email = models.EmailField("邮箱", db_index=True)
    avatar = models.ImageField("头像", upload_to=set_upload_path, default=None,
                               blank=True, null=True)
    gender = models.PositiveSmallIntegerField(
        "性别", default=GenderType.unknown, choices=GenderType.attrs.items()
    )
    user_type = models.PositiveSmallIntegerField(
        "类型", default=UserType.visitor, choices=UserType.attrs.items()
    )
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    update_time = models.DateTimeField("更新时间", auto_now=True)

    class Meta:
        verbose_name = "用户"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.nickname


class SEORecord(models.Model):
    url_name = models.CharField("url名称", max_length=50) 
    values = models.CharField("url值", max_length=50, default="", blank=True) 
    title = models.CharField("标题", max_length=100)
    keywords = models.CharField("关键词", max_length=200, default="", blank=True)
    description = models.TextField("描述", default="", blank=True)
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    update_time = models.DateTimeField("更新时间", auto_now=True)

    class Meta:
        verbose_name = "SEO信息"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.title
