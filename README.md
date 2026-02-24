# Fighting Spirit Dojo

Sitio web completo para un gimnasio de artes marciales. Landing page profesional con formulario de contacto dual (WhatsApp + base de datos), panel de administración y backend REST.

## Demo

> Reemplazá con tu URL de Vercel una vez deployado

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 · React 18 · TypeScript |
| Estilos | Tailwind CSS · Shadcn/ui · Radix UI |
| Backend | Django 5.2 · Django REST Framework |
| Base de datos | PostgreSQL ( Render) · SQLite (dev) |
| Deploy | Vercel (frontend) · Render (backend) |
| Extras | reCAPTCHA v2 · WhatsApp API · OpenStreetMap |

---

## Funcionalidades

- **Landing page** con secciones: Hero, Disciplinas, Horarios, Instructores, Planes de membresía, Contacto y Mapa
- **Modales** con info detallada de cada disciplina y plan
- **Formulario de contacto** que guarda en la base de datos y abre WhatsApp simultáneamente
- **Panel admin** en `/admin` para ver y gestionar contactos sin entrar al admin de Django
- **Hamburger menu** responsive para mobile
- **Rate limiting** en el backend (5 requests/hora por IP anónima)
- **Seguridad**: CORS restringido, headers HTTP, reCAPTCHA, variables de entorno

---

## Estructura del proyecto

```
dojo-pag/
├── app/
│   ├── page.tsx              # Landing page principal
│   ├── admin/page.tsx        # Panel de administración
│   ├── api/
│   │   ├── contacto/         # Endpoint del formulario
│   │   └── admin/contactos/  # Endpoint del panel admin
│   └── layout.tsx
├── components/
│   ├── StaticMap.tsx         # Mapa OpenStreetMap
│   └── ui/                   # Componentes Shadcn/ui
├── lib/
│   ├── data/                 # Datos estáticos (disciplinas, planes, etc.)
│   └── supabaseServer.js
└── backend/                  # Django REST API
    ├── contactos/            # App de contactos
    └── backend/              # Configuración Django
```

---

## Instalación local

### Requisitos
- Node.js 18+
- Python 3.11+

### Frontend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus valores

# Levantar servidor de desarrollo
npm run dev
```

Disponible en `http://localhost:3000`

### Backend

```bash
cd backend

# Instalar dependencias Python
pip install -r requirements.txt

# Configurar variables de entorno
# Crear backend/.env con las variables necesarias

# Aplicar migraciones
python manage.py migrate

# Levantar servidor
python manage.py runserver
```

Disponible en `http://127.0.0.1:8000`

---

## Variables de entorno

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=    # Número WhatsApp del gym (ej: 59899123456)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY= # Google reCAPTCHA v2 site key
NEXT_PUBLIC_API_BASE=           # URL del backend Django
BACKEND_URL=                    # URL del backend (server-side)
ADMIN_PASSWORD=                 # Contraseña del panel /admin
```

### Backend (`backend/.env`)

```env
DJANGO_SECRET_KEY=      # Secret key de Django
DJANGO_DEBUG=False
ALLOWED_HOSTS=          # Hosts permitidos (ej: localhost,*.railway.app)
DATABASE_URL=           # URL de PostgreSQL
FRONTEND_ORIGINS=       # URL del frontend para CORS (ej: https://tu-app.vercel.app)
RECAPTCHA_SECRET_KEY=   # Google reCAPTCHA secret key
```

---

## Panel de administración

Accedé en `/admin` con la contraseña configurada en `ADMIN_PASSWORD`.

Permite:
- Ver todos los contactos recibidos
- Filtrar por disciplina
- Marcar contactos como "contactado" con un click

---



