"""
Django settings for blog project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

from datetime import date
from blog.config import CommonConfig

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'k2ult1sb6a^3%ini9biku^vtmt-(+im1__&*izcir0ssislod5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = CommonConfig.debug

TEMPLATE_DEBUG = True
TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'blog/templates'),
    os.path.join(BASE_DIR, 'blog/artical/templates'),
    os.path.join(BASE_DIR, 'blog/album/templates'),
    os.path.join(BASE_DIR, 'blog/repository/templates')
)

ALLOWED_HOSTS = CommonConfig.allow_host


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'south',
    'blog.management',
    'blog.repository',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'blog.urls'

WSGI_APPLICATION = 'blog.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': CommonConfig.DB_NAME,
        'USER': CommonConfig.DB_USER,
        'PASSWORD': CommonConfig.DB_PASSWORD,
        'HOST': CommonConfig.DB_HOST,
        'PORT': CommonConfig.DB_PORT,
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True


MEDIA_URL = '/media/'
MEDIA_ROOT = CommonConfig.media_root

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATICFILES_DIRS =(
    os.path.join(BASE_DIR, 'blog/static'),
    os.path.join(BASE_DIR, 'blog/artical/static'),
    os.path.join(BASE_DIR, 'blog/album/static'),
    os.path.join(BASE_DIR, 'blog/repository/static')
)
STATIC_URL = '/static/'
STATIC_ROOT = CommonConfig.static_root

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'short': {
            'format': "%(levelname)s %(asctime)s \"%(message)s\" ",
            'datefmt': "%Y-%m-%d %H:%M:%S",
        },
        'normal': {
            'format': "%(levelname)s %(asctime)s %(pathname)s %(lineno)s \"%(message)s\" ",
            'datefmt': "%Y-%m-%d %H:%M:%S",
        },
        'long':{
            'format': "%(levelname)s %(name)s %(asctime)s %(pathname)s %(funcName)s %(lineno)s \"%(message)s\" ",
            'datefmt': "%Y-%m-%d %H:%M:%S",
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'require_debug_true': {
            '()': 'blog.utils.log.RequireDebugTrue'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'formatter': 'long',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler',
        },
        'request': {
            'level': 'INFO',
            'formatter': 'short',
            'filters': ['require_debug_false'],
            'class': 'logging.FileHandler',
            'filename': '%s%s.log' % (CommonConfig.log_path, date.today()),
            'encoding': 'utf-8',
            'delay': True,
        },
        'save_to_file':{
            'level': 'INFO',
            'formatter': 'normal',
            'filters': ['require_debug_false'],
            'class': 'logging.FileHandler',
            'filename': '%s%s.log' % (CommonConfig.log_path, date.today()),
            'encoding': 'utf-8',
            'delay': True,
        },
        'django_console':{
            'level': 'DEBUG',
            'formatter': 'short',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        },
        'console':{
            'level': 'DEBUG',
            'formatter': 'long',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['request', 'django_console'],
            'level': 'DEBUG',
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'blog': {
            'handlers': ['save_to_file', 'console', 'mail_admins'],
            'level': 'DEBUG',
        },
    }
}

