# backend/backend/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# --- Paths / .env (útil en local) ---
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env", override=True)

# --- Entorno / Seguridad ---
DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() == "true"

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "dev-insecure-key-no-usar-en-prod"
    else:
        raise RuntimeError("Falta DJANGO_SECRET_KEY")

# Railway te da subdominio *.up.railway.app
ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1,.up.railway.app,.railway.app"
).split(",")

# Si validás reCAPTCHA en Django, poné la env; si no, queda vacío y no molesta
RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY", "")

# --- Apps ---
INSTALLED_APPS = [
    # 'whitenoise.runserver_nostatic',  # opcional para servir estáticos en dev
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "contactos",
]

# --- Middleware (orden correcto; WhiteNoise después de Security) ---
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

WSGI_APPLICATION = "backend.wsgi.application"

# --- Base de datos (Railway → DATABASE_URL) ---
DATABASES = {
    "default": dj_database_url.config(
        env="DATABASE_URL",
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

# --- i18n ---
LANGUAGE_CODE = "es"
TIME_ZONE = "America/Montevideo"
USE_I18N = True
USE_TZ = True

# --- Static / WhiteNoise ---
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- CORS/CSRF (tu front en Vercel) ---
# si querés parametrizarlo, podés setear FRONTEND_ORIGINS="https://dojo-pag.vercel.app,https://otro.com"
_frontends = os.getenv("FRONTEND_ORIGINS", "https://dojo-pag.vercel.app").split(",")
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [o.strip() for o in _frontends if o.strip()]

CSRF_TRUSTED_ORIGINS = [o.strip() for o in _frontends if o.strip()] + [
    "https://*.up.railway.app",
    "https://*.railway.app",
]

# --- Proxy TLS detrás de Railway ---
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

# --- DRF: abierto para este caso ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
}

# --- Logging básico a consola (útil en Railway) ---
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}
