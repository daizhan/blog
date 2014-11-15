# -*- coding: utf-8 -*-

import os

LOCAL_HOST = ''
BASE_DIR = '' # absolute path

class CommonConfig():
    """ global config """

    # debug
    debug = False

    # when debug is close, allow host must be configured
    allow_host = []

    # database connection
    DB_NAME = ''
    DB_USER = ''
    DB_PASSWORD = ''
    DB_HOST = LOCAL_HOST
    DB_PORT = ''

    # log
    log_path = os.path.join(BASE_DIR, 'log path')

    # media root
    media_root = os.path.join(BASE_DIR, 'media root path')

    # static root
    static_root = os.path.join(BASE_DIR, 'static root path')

