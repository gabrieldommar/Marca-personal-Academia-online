from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.database import init_db
from app.routes import auth, brand, comments, courses


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Academia & Marca Personal API",
    description=(
        "API de la plataforma: marca personal (colaboraciones), academia online "
        "(cursos por categoría con contenido PDF/video) y comentarios moderados. "
        "Autenticación vía Google OAuth 2.0; rol de administrador por email."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authlib usa la sesión de Starlette para guardar el state del flujo OAuth.
app.add_middleware(SessionMiddleware, secret_key=settings.jwt_secret)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(courses.content_router)
app.include_router(brand.router)
app.include_router(comments.router)

# Sirve los archivos subidos (PDF / video directo) en /storage.
Path(settings.storage_dir).mkdir(parents=True, exist_ok=True)
app.mount("/storage", StaticFiles(directory=settings.storage_dir), name="storage")


@app.get("/api/health", tags=["health"], summary="Healthcheck del servicio")
def health():
    return {"status": "ok"}


