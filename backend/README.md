# Backend — Academia & Marca Personal (FastAPI)

API REST: marca personal (colaboraciones), academia (cursos por categoría con PDF/video) y comentarios moderados. Auth con Google OAuth 2.0 + JWT; rol admin por email.

## Requisitos
- Python 3.11+

## Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1      # Windows PowerShell
# source .venv/bin/activate        # macOS/Linux
pip install -r requirements.txt
copy .env.example .env             # cp en macOS/Linux  → completar credenciales
```

Completar en `.env`:
- `JWT_SECRET` (obligatorio)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google Cloud Console → OAuth 2.0)
- `GOOGLE_REDIRECT_URI` debe coincidir con el registrado en Google: `http://localhost:8000/api/auth/callback`

## Ejecutar

```bash
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000/api
- Docs interactivas (OpenAPI): http://localhost:8000/docs
- Archivos subidos: http://localhost:8000/storage/...

La base SQLite (`app.db`) y la carpeta `storage/` se crean automáticamente al arrancar.

## Exportar OpenAPI

```bash
python -m scripts.export_openapi   # genera backend/openapi.json
```

## Estructura

```
app/
  main.py          # FastAPI, CORS, SessionMiddleware, routers, /storage
  config.py        # Settings desde .env
  database.py      # engine SQLite + Base + get_db
  oauth.py         # cliente Authlib (Google)
  models/          # User, Course+Content, Comment, Collaboration
  schemas/         # Pydantic in/out
  routes/          # auth, courses, brand, comments
  services/        # lógica de negocio + storage de archivos
  middleware/      # auth.py (JWT, get_current_user/admin)
scripts/
  export_openapi.py
```

## Roles y seguridad
- El rol admin se asigna en el servidor comparando el email de Google contra `ADMIN_EMAIL`.
- Endpoints de escritura del admin exigen `Authorization: Bearer <jwt>` con `is_admin=true`.
- Los archivos nunca se guardan en BD: solo su ruta en `Content.url`.
