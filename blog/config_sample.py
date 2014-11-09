# -*- coding: utf-8 -*-

import os

LOCAL_HOST = ''
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

class CommonConfig():
    """ global config """

    # database connection
    DB_NAME = ''
    DB_USER = ''
    DB_PASSWORD = ''
    DB_HOST = LOCAL_HOST
    DB_PORT = ''

    # log
    log_path = os.path.join(BASE_DIR, 'log/application/')

