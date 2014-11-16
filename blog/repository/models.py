# -*- coding: utf-8 -*-

from django.db import models

from blog.management.models import User
from blog.utils.models import set_upload_path
from blog.const.choices import StatusType, UGCStatusType


class Category(models.Model):
    parent = models.ForeignKey('self', verbose_name="上级类别", default=None,
                               blank=True, null=True)
    name = models.CharField("名称", max_length=50)
    desc = models.TextField("描述", default='', blank=True)
    img = models.ImageField("图片", upload_to=set_upload_path)
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )

    class Meta:
        verbose_name = "仓库类别"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField("名称", max_length=50)
    desc = models.TextField("描述", default='', blank=True)
    img = models.ImageField("图片", upload_to=set_upload_path, default='',
                            blank=True, null=True)
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )

    class Meta:
        verbose_name = "仓库内容标签"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name


class Stuff(models.Model):
    name = models.CharField("名称", max_length=50)
    desc = models.TextField("描述", default='', blank=True)
    img = models.ImageField("图片", upload_to=set_upload_path, default='',
                            blank=True, null=True)
    access_count = models.IntegerField("访问数", default=0, blank=True)
    comment_count = models.IntegerField("评论数", default=0, blank=True)
    good_count = models.IntegerField("点赞数", default=0, blank=True)
    star = models.FloatField("星级", default=0, blank=True)
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )

    class Meta:
        verbose_name = "仓库内容"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name


class Comment(models.Model):
    stuff = models.ForeignKey(Stuff, verbose_name="评论对象")
    user = models.ForeignKey(User, verbose_name="用户")
    content = models.TextField("评论内容")
    star = models.PositiveSmallIntegerField("评星", default=0)
    good_count = models.IntegerField("点赞数", default=0, blank=True)
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        "状态", default=UGCStatusType.normal, choices=UGCStatusType.attrs.items()
    )

    class Meta:
        verbose_name = "仓库内容评论"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.content


class Reply(models.Model):
    comment = models.ForeignKey(Stuff, verbose_name="评论")
    to_reply = models.ForeignKey('self', verbose_name="回复")
    user = models.ForeignKey(User, verbose_name="用户")
    content = models.TextField("回复内容")
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        "状态", default=UGCStatusType.normal, choices=UGCStatusType.attrs.items()
    )

    class Meta:
        verbose_name = "仓库内容回复"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.content
