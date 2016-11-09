# -*- coding: utf-8 -*-

import hashlib
from datetime import datetime
import logging

from django.shortcuts import render_to_response
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect

from django.core.urlresolvers import reverse

from blog.utils.log import logger


def index(reqeust, *args, **kwargs):
    return HttpResponseRedirect(reverse('repository_index'))


def test(reqeust, *args, **kwargs):
    context = {'now_time': datetime.now()}
    return render_to_response('test.html', context)


def weixin_token_check(request, *args, **kwargs):
    """ 微信Token 接口验证 """
    # test /weixin/token_check/?signature=1b3b9fb21920a24eb86571329abc03a29878ac21&echostr=5973077763949330395&timestamp=1457171595&nonce=1716428967

    signature = request.GET.get("signature", "")
    echostr = request.GET.get("echostr", "")
    timestamp = request.GET.get("timestamp", "")
    nonce = request.GET.get("nonce", "")
    token = "bigzhan"

    check_args = [timestamp, nonce, token]
    check_args.sort()
    arg = "".join(check_args)
    my_signature = hashlib.sha1(arg).hexdigest()
    if my_signature == signature:
        return HttpResponse(echostr)
    else:
        logger.info("token check failed");
        return HttpResponse("token check failed")
