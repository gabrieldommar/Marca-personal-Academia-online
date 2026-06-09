# Frontend — Academia & Marca Personal (React + Vite + Tailwind)

SPA en React. Diseño minimalista-editorial (ver [design-system.md](./design-system.md)).

## Requisitos
- Node 18+

## Setup

```bash
cd frontend
npm install
copy .env.example .env     # cp en macOS/Linux
npm run dev                # http://localhost:5173
```

`VITE_API_URL` apunta al backend (`http://localhost:8000/api`).

## Login con Google
El botón redirige a `${VITE_API_URL}/auth/login`. Tras autenticar, el backend
redirige a `/auth/callback?token=...`; el token se guarda en `localStorage`
(`auth_token`) y se hidrata el usuario con `GET /auth/me`.

## Estructura

```
src/
  main.jsx              # entry, Router + AuthProvider
  App.jsx               # rutas
  index.css             # Tailwind + estilos base
  components/
    ui/                 # Button, Container (átomos)
    layout/             # Header, Footer
    auth/               # GoogleLoginButton
  pages/                # HomePage, CategoryPage, CoursePage, AdminPage, AuthCallbackPage, NotFoundPage
  hooks/                # useAuth (contexto de sesión)
  services/             # api.js (fetch + token), authService.js
```

## Rutas
- `/` — inicio (hero, colaboraciones, cursos, comentarios)
- `/cursos/:category` — cursos por categoría
- `/cursos/:category/:slug` — detalle con visor PDF/video
- `/admin` — panel protegido (solo admin)
- `/auth/callback` — recibe el token de Google
