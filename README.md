# Luciano Nuñez — Academia & Marca Personal

Sitio web personal con academia online. Incluye cursos estructurados por categoría (ingreso a medicina, medicina y programación), colaboraciones, comentarios moderados y panel de administración.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Backend | FastAPI + SQLAlchemy 2.0 (Python 3.12) |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| Auth | Google OAuth 2.0 + JWT |
| Almacenamiento | Filesystem local (`./storage`) |

## Requisitos

- Python 3.12+
- Node.js 18+
- Cuenta de Google Cloud con OAuth 2.0 configurado

## Setup

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux / macOS

pip install -r requirements.txt
```

Crear `backend/.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Variables requeridas en `.env`:

```env
DATABASE_URL=sqlite:///./app.db
JWT_SECRET=cambia_esto_por_un_secreto_seguro
JWT_EXPIRE_HOURS=24

GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/callback

ADMIN_EMAIL=tu_email@gmail.com
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
STORAGE_DIR=./storage
```

Iniciar el servidor:

```bash
uvicorn app.main:app --reload
```

API disponible en `http://localhost:8000` · Docs en `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
```

Crear `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Sitio disponible en `http://localhost:5173`

## Estructura del proyecto

```
backend/
  app/
    models/       # User, Course, Content, Comment, Collaboration
    schemas/      # Pydantic schemas
    routes/       # auth, courses, brand, comments
    services/     # lógica de negocio + storage
    middleware/   # auth JWT
  requirements.txt
  .env.example

frontend/
  src/
    components/
      ui/         # Button, Form, States, ImageUploadField, Container
      layout/     # Header, Footer
      home/       # Hero, CoursesByCategory, Collaborations, ApprovedComments
      courses/    # CourseCard, CourseContent, VideoPlayer
      admin/      # CourseManager, CollaborationManager, CommentModeration
      auth/       # GoogleLoginButton, RequireAdmin
    pages/        # HomePage, CategoryPage, CoursePage, AdminPage, AuthCallbackPage
    services/     # api, courseService, commentService, collaborationService, uploadService
    hooks/        # useAuth, useFetch
```

## Funcionalidades

- **Academia**: cursos por categoría con contenido PDF y video (YouTube, Vimeo o directo)
- **Marca personal**: sección de colaboraciones y clientes con logos
- **Comentarios**: flujo de moderación (pending → approved/rejected)
- **Admin**: panel protegido para gestionar cursos, contenidos, colaboraciones y comentarios
- **Subida de archivos**: PDF, video directo e imágenes desde el panel admin
- **Auth**: login con Google; rol admin determinado por `ADMIN_EMAIL` en el servidor

## Categorías de cursos

| Slug | Label |
|------|-------|
| `ingreso-medicina` | Ingreso Medicina |
| `medicina` | Medicina |
| `programacion` | Programación |

## Personalización del Hero

El contenido del hero (stats, bio, tagline) está centralizado en el objeto `PROFILE` al inicio de `frontend/src/components/home/Hero.jsx`. Editá ese objeto con tus datos reales.

## Tests

```bash
# Frontend (Vitest)
cd frontend && npm test

# Playwright e2e (requiere ambos servidores corriendo)
cd frontend && npx playwright test
```
