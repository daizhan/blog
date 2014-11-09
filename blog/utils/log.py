#! /usr/bin/python
# -*- coding: utf-8 -*-

import logging
try:
    from blog.settings import DEBUG
except ImportError:
    DEBUG = False


logger = logging.getLogger('blog')


class RequireDebugTrue():

    """ if set debug to True, return yes, otherwise to no """

    def filter(self, record):
        if isinstance(DEBUG, bool):
            return DEBUG
        else:
            raise Exception("invalid settings, [DEBUG = %s]" % DEBUG)


