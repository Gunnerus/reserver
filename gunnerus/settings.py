"""
Django settings for gunnerus project.

Generated by 'django-admin startproject' using Django 1.11.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os
from reserver.secrets import RESERVER_MAILGUN_ACCESS_KEY, RESERVER_MAILGUN_SERVER_NAME, RESERVER_SECRET_KEY, RESERVER_MAILGUN_SENDER_DOMAIN

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = RESERVER_SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

import socket
local_ip = socket.gethostbyname(socket.gethostname())

print("This machine's IP address is " + local_ip + ", allowing requests to this hostname")

ALLOWED_HOSTS = ["37.139.28.130", "188.226.173.94", "rvgunnerus.no", "dev.rvgunnerus.no", "reserver.471.no", ".471.no", "127.0.0.1", local_ip]

#INTERNAL_IPS = ["127.0.0.1"]

LOGIN_URL = 'login'

LOGIN_REDIRECT_URL = 'home'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'reserver.apps.ReserverConfig',
	'bootstrap3',
	'anymail',
	'hijack',
	'compat',
#	'debug_toolbar',
#	'template_timings_panel'
]

HIJACK_LOGIN_REDIRECT_URL = '/user/'  # Where admins are redirected to after hijacking a user
HIJACK_LOGOUT_REDIRECT_URL = '/admin/users/'  # Where admins are redirected to after releasing a user
HIJACK_USE_BOOTSTRAP = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
#   'django.middleware.clickjacking.XFrameOptionsMiddleware',
#	'debug_toolbar.middleware.DebugToolbarMiddleware'
]

DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
	'template_timings_panel.panels.TemplateTimings.TemplateTimings',
	'debug_toolbar.panels.profiling.ProfilingPanel'
]

ROOT_URLCONF = 'gunnerus.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
				'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'gunnerus.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Oslo'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

# User-uploaded files

MEDIA_URL = '/uploads/'

MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'uploads/')

# Email settings

ANYMAIL = {
	"MAILGUN_API_KEY": RESERVER_MAILGUN_ACCESS_KEY,
	"MAILGUN_SENDER_DOMAIN": RESERVER_MAILGUN_SENDER_DOMAIN,
}

EMAIL_BACKEND = 'anymail.backends.mailgun.EmailBackend'
DEFAULT_FROM_EMAIL = 'no-reply@rvgunnerus.no'

try:
	from reserver.secrets import IS_DEV_SERVER
	IS_DEV_SERVER
except (NameError, ImportError):
	IS_DEV_SERVER = True

if IS_DEV_SERVER:
	DEFAULT_FROM_EMAIL = 'dev-server@rvgunnerus.no'
	
print("Default outgoing email address set to " + DEFAULT_FROM_EMAIL)

EMAIL_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'uploads/debug-emails/')