# backend/Dockerfile
FROM python:3.11-slim

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Actualizar pip
RUN pip install --upgrade pip

# Directorio de trabajo
WORKDIR /app

# Copiar solo requirements primero (para cache de Docker)
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install -r requirements.txt

# Copiar el resto del código
COPY . .

# Crear directorio para archivos estáticos
RUN mkdir -p staticfiles

# Comando de inicio
CMD python manage.py migrate --no-input && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120