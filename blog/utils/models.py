# -*- coding: utf-8 -*-

""" all utility about models and admins """

import os
import hashlib
from datetime import datetime
import time

from blog.settings import MEDIA_ROOT


def set_upload_path(model_ins, filename):
    model_name = model_ins.__name__.lower()
    path = "%s/%s" (model_name, datetime.now().strftime('%Y/%m/%d'))
    full_path = os.path.join(MEDIA_ROOT, path)
    uniq_name = hashlib.md5(filename+str(time.time())).hexdigest()
    return os.path.join(full_path, uniq_name)


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
