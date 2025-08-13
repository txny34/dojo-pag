#!/bin/bash

# Ejecutar migraciones
echo "Ejecutando migraciones..."
python manage.py migrate --noinput

# Recopilar archivos estáticos
echo "Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

# Iniciar el servidor con gunicorn
echo "Iniciando servidor..."
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT