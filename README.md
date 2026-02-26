# Dojo Pag

Sitio web completo para un gimnasio de artes marciales. Landing page profesional con formulario de contacto dual (WhatsApp + base de datos), panel de administración y backend REST.

## Demo

**[https://dojo-pag.vercel.app](https://dojo-pag.vercel.app)**

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 · React 18 · TypeScript |
| Estilos | Tailwind CSS · Shadcn/ui · Radix UI |
| Backend | Django 5.2 · Django REST Framework |
| Base de datos | SQLite (dev) · PostgreSQL (prod) |
| Deploy | Vercel (frontend) · Render (backend) |
| Extras | reCAPTCHA v2 · WhatsApp API · OpenStreetMap |

---

## Funcionalidades

- **Landing page** con secciones: Hero, Disciplinas, Horarios, Instructores, Planes de membresía, Contacto y Mapa
- **Modales** con info detallada de cada disciplina y plan
- **Formulario de contacto** que guarda en la base de datos y abre WhatsApp simultáneamente
- **Panel admin** en `/admin` — ver, filtrar, marcar contactados, agregar notas y exportar CSV
- **Config centralizada** en `lib/data/dojo.config.ts` — un solo archivo para personalizar por cliente
- **Hamburger menu** responsive para mobile
- **Seguridad**: CORS restringido, reCAPTCHA v2, variables de entorno separadas por capa

---

## Estructura del proyecto

```
dojo-pag/
├── app/
│   ├── page.tsx              # Orquestador principal (estado + handlers)
│   ├── admin/page.tsx        # Panel de administración
│   ├── api/
│   │   ├── contacto/         # Endpoint del formulario
│   │   └── admin/contactos/  # Endpoint del panel admin
│   └── layout.tsx
├── components/
│   ├── sections/             # Secciones de la landing (Nav, Hero, About, etc.)
│   ├── ModalDisciplina.tsx
│   ├── ModalPlan.tsx
│   ├── StaticMap.tsx
│   └── ui/                   # Componentes Shadcn/ui
├── lib/
│   ├── contact-form.ts       # Tipos y validación del formulario
│   └── data/                 # Config y datos estáticos
│       ├── dojo.config.ts    # ← Personalizar por cliente
│       ├── disciplinas.ts
│       ├── planes.ts
│       ├── instructores.ts
│       └── horarios.ts
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
npm install

cp .env.local.example .env.local
# Editar .env.local con tus valores

npm run dev
```

Disponible en `http://localhost:3000`

### Backend

```bash
cd backend

pip install -r requirements.txt

# Crear backend/.env con las variables necesarias

python manage.py migrate
python manage.py runserver
```

Disponible en `http://127.0.0.1:8000`

---

## Variables de entorno

### Frontend (`.env.local` / Vercel)

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=    # Número WhatsApp del gym (ej: 59899123456)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY= # Google reCAPTCHA v2 checkbox site key
NEXT_PUBLIC_API_BASE=           # URL del backend Django
BACKEND_URL=                    # URL del backend (server-side)
ADMIN_PASSWORD=                 # Contraseña del panel /admin
```

### Backend (`backend/.env` / Render)

```env
DJANGO_SECRET_KEY=      # Secret key de Django
DJANGO_DEBUG=False
ALLOWED_HOSTS=          # Hosts permitidos (ej: localhost,*.onrender.com)
DATABASE_URL=           # URL de PostgreSQL (opcional, usa SQLite si no se define)
FRONTEND_ORIGINS=       # URL del frontend para CORS
RECAPTCHA_SECRET_KEY=   # Google reCAPTCHA secret key (opcional)
```

---

## Panel de administración

Accedé en `/admin` con la contraseña configurada en `ADMIN_PASSWORD`.

- Ver todos los contactos recibidos con filtros y búsqueda
- Marcar como contactado / pendiente (individual o bulk)
- Agregar notas internas por contacto
- Exportar a CSV
- Ordenar por cualquier columna

---

## Personalización por cliente

Para adaptar el sitio a un nuevo dojo editá únicamente estos archivos:

| Archivo | Qué contiene |
|---------|-------------|
| `lib/data/dojo.config.ts` | Nombre, dirección, teléfono, coords, horarios, stats |
| `lib/data/disciplinas.ts` | Info de cada disciplina (modales) |
| `lib/data/planes.ts` | Planes y precios |
| `lib/data/instructores.ts` | Cards de instructores |
| `lib/data/horarios.ts` | Grilla de horarios |
| `public/images/` | Fotos del lugar |
