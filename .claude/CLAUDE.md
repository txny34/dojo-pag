# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Next.js)
```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Serve production build
```

### Backend (Django)
```bash
cd backend
python manage.py runserver          # Dev server on 127.0.0.1:8000
python manage.py migrate            # Apply migrations
python manage.py makemigrations     # Generate migrations after model changes
python manage.py createsuperuser    # Create Django admin user
python manage.py test contactos     # Run integration tests
```

## Architecture

**Two-layer stack:** Next.js (Vercel) + Django REST Framework (Render/Railway).

Next.js never talks to the DB directly — all data goes through Next.js API routes (`app/api/`) which proxy to Django, adding server-side auth.

```
Browser → Next.js (Vercel)
              ├── app/api/contacto/     → Django POST /contactos/
              └── app/api/admin/        → Django GET/PATCH/DELETE /contactos/:id/
                    ↑ checks x-admin-password header vs ADMIN_PASSWORD env
```

### Frontend structure
- `app/page.tsx` — orchestrator: owns all form state and cross-section callbacks, renders section components
- `components/sections/` — one file per landing section (Nav, Hero, About, Disciplines, Schedule, Instructors, Membership, Contact, Footer). Each section owns its own local state (e.g., NavSection owns mobileMenuOpen).
- `components/ModalDisciplina.tsx`, `ModalPlan.tsx` — detail modals, rendered in page.tsx
- `lib/contact-form.ts` — shared types, validation, and helpers for the contact form
- `lib/data/dojo.config.ts` — single config file for all gym-specific data (name, address, phone, coords, stats)
- `lib/data/disciplinas.ts`, `planes.ts`, `instructores.ts`, `horarios.ts` — static content data

### Backend structure
- `backend/contactos/` — single Django app with model, serializer, views (ModelViewSet), and reCAPTCHA util
- `backend/backend/settings.py` — reads all config from env vars; falls back to SQLite if no DATABASE_URL

## Key patterns

**Config-driven white-label:** Edit only `lib/data/dojo.config.ts` and the files in `lib/data/` to adapt the site to a new gym client. No other files need changing for content.

**ReCAPTCHA reset:** `next/dynamic` drops ref types, so ReCAPTCHA is reset by incrementing a `recaptchaKey` state that's passed as `key={recaptchaKey}` to the component, forcing a remount instead of calling `.reset()` via ref.

**Admin auth:** Password checked server-side in Next.js API routes via `x-admin-password` header. The Django backend has no auth — it relies on Next.js as a proxy layer.

**CORS:** Django only allows origins listed in `FRONTEND_ORIGINS` env var. In dev (DEBUG=True), localhost:3000 is automatically added.

## Environment variables

### Frontend (`.env.local` / Vercel)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (country code + number, no + or spaces) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 "I'm not a robot" Checkbox site key |
| `NEXT_PUBLIC_API_BASE` | Backend URL (client-side, for form submission) |
| `BACKEND_URL` | Backend URL (server-side, for API routes) |
| `ADMIN_PASSWORD` | Password for `/admin` panel |

### Backend (`backend/.env` / Render)
| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key |
| `DJANGO_DEBUG` | Set to `True` for dev only |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `DATABASE_URL` | PostgreSQL URL (omit to use SQLite) |
| `FRONTEND_ORIGINS` | Comma-separated allowed CORS origins |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA server-side secret (optional) |

## Deployment notes

- **Render free tier** has cold starts (~30-60s on first request after inactivity). Normal behavior.
- After saving env vars in Vercel, a **redeploy is required** for changes to take effect.
- reCAPTCHA key must be type **v2 "I'm not a robot" Checkbox** — not invisible, not v3.
- The Vercel domain must be added to the allowed domains list in Google reCAPTCHA console.
