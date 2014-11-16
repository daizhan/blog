# -*- coding: utf-8 -*-

""" all choices maybe used in models and views """

from blog.utils.storage import Const


class StatusType(Const):

    deleted = (0, "已删除")
    normal = (1, "正常")


class UGCStatusType(Const):

    normal = (1, "普通")
    good = (2, "优质")
    jumk = (3, "垃圾")
    deleted = (4, "已删除")


class UserType(Const):

    visitor = (1, "普通访客")
    credit = (2, "认证访客")
    host = (3, "博主")
    admin = (4, "系统管理员")


class GenderType(Const):

    unknown = (1, "未知")
    male = (2, "男")
    female = (3, "女")

