# backend/Dockerfile
FROM python:3.11-slim

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copiar requirements e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Crear directorio para archivos estáticos
RUN python manage.py collectstatic --noinput --clear || true

# Exponer puerto
EXPOSE $PORT

# Comando de inicio
CMD python manage.py migrate --no-input && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120