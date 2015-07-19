# -*- coding: utf-8 -*-

""" all utility about models and admins """

import os
import hashlib
from datetime import datetime
import time
import random


def set_upload_path(model_ins, filename):
    model_name = model_ins.__class__.__name__.lower()
    path = "%s/%s" % (model_name, datetime.now().strftime('%Y/%m/%d'))
    uniq_name = hashlib.md5(filename+str(time.time())).hexdigest()
    return os.path.join(path, uniq_name)


def img_thumb(model_ins):
    html = ''
    if model_ins.img:
        html = "<img src='%s' style='max-width:150px; height:auto;' />" % model_ins.img.url
    return html
img_thumb.allow_tags = True
img_thumb.short_description = "图片"


def avatar_thumb(model_ins):
    html = ''
    if model_ins.avatar:
        html = "<img src='%s' style='width:80px; height:80px;' />" % model_ins.avatar.url
    return html
avatar_thumb.allow_tags = True
avatar_thumb.short_description = "头像"


def get_record_time(dt):
    if dt:
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    else:
        return ''


def get_create_time(model_ins):
    return get_record_time(model_ins.create_time)
get_create_time.short_description = "创建时间"


def get_update_time(model_ins):
    return get_record_time(model_ins.update_time)
get_update_time.short_description = "更新时间"


def get_online_time(model_ins):
    return get_record_time(model_ins.online_time)
get_online_time.short_description = "上线时间"


def get_offline_time(model_ins):
    return get_record_time(model_ins.offline_time)
get_offline_time.short_description = "下线时间"


def set_default_slug(seed=None):
    if seed is None:
        seed = time.time() + random.random()
    random.seed(seed)
    return hashlib.md5(str(time.time() + random.random())).hexdigest()[:8];


