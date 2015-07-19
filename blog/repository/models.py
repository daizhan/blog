# -*- coding: utf-8 -*-

from django.db import models

from blog.management.models import User
from blog.utils.models import set_upload_path, set_default_slug
from blog.const.choices import StatusType, UGCStatusType, StuffType, VerifyType


class Tag(models.Model):
    slug = models.CharField(
        "唯一标识符", max_length=8, unique=True, editable=False,
        default=set_default_slug
    )
    name = models.CharField("名称", max_length=50)
    desc = models.TextField("描述", default='', blank=True)
    img = models.ImageField(
        "图片", upload_to=set_upload_path, default='', blank=True, null=True
    )
    count = models.IntegerField("条目统计", default=0, blank=True)
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
    slug = models.CharField(
        "唯一标识符", max_length=8, unique=True, editable=False,
        default=set_default_slug
    )
    name = models.CharField("名称", max_length=50)
    desc = models.TextField("描述", default='', blank=True)
    img = models.ImageField(
        "图片", upload_to=set_upload_path, default='', blank=True, null=True
    )
    tags = models.ManyToManyField(Tag, verbose_name="标签", default=None, blank=True)
    type = models.PositiveSmallIntegerField(
        "类型", default=StuffType.exercise, choices=StuffType.attrs.items()
    )
    access_count = models.IntegerField("访问数", default=0, blank=True)
    comment_count = models.IntegerField("评论数", default=0, blank=True)
    good_count = models.IntegerField("点赞数", default=0, blank=True)
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    verify = models.PositiveSmallIntegerField(
        "审核状态", default=VerifyType.draft, choices=VerifyType.attrs.items()
    )
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )
    remark = models.CharField("备注", max_length=100, default="", blank=True)

    class Meta:
        verbose_name = "仓库内容"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name


class StaticPage(models.Model):
    stuff = models.ForeignKey(
        Stuff, verbose_name="模板",
        limit_choices_to={'type__in': [StuffType.exercise, StuffType.static_page]}
    )
    label = models.CharField("页面标签", max_length=50, default='', blank=True)
    url_code = models.CharField("页面url", max_length=50)
    desc = models.TextField("描述", default='', blank=True)
    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    template = models.CharField("模板路径", max_length=100)
    verify = models.PositiveSmallIntegerField(
        "审核状态", default=VerifyType.draft, choices=VerifyType.attrs.items()
    )
    status = models.PositiveSmallIntegerField(
        "状态", default=StatusType.normal, choices=StatusType.attrs.items()
    )
    remark = models.CharField("备注", max_length=100, default="", blank=True)

    class Meta:
        verbose_name = "静态页面"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.label


class Comment(models.Model):
    slug = models.CharField(
        "唯一标识符", max_length=8, unique=True, editable=False,
        default=set_default_slug
    )
    stuff = models.ForeignKey(Stuff, verbose_name="评论对象")
    user = models.ForeignKey(User, verbose_name="用户")
    content = models.TextField("评论内容")
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
    slug = models.CharField(
        "唯一标识符", max_length=8, unique=True, editable=False,
        default=set_default_slug
    )
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
