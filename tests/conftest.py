import os
import sys
from pathlib import Path

# Configurar entorno ANTES de importar la app (Settings se instancia al importar).
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("ADMIN_EMAIL", "feraligart160@gmail.com")
os.environ.setdefault("DATABASE_URL", "sqlite://")

BACKEND = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  (registra los modelos en el metadata)
from app.database import Base, get_db
from app.main import app
from app.middleware.auth import create_access_token
from app.models.user import User

# SQLite en memoria compartida entre conexiones.
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _reset_db():
    Base.metadata.create_all(test_engine)
    yield
    Base.metadata.drop_all(test_engine)


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client():
    return TestClient(app)


def _make_user(db, email, name, role):
    u = User(email=email, name=name, role=role)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


@pytest.fixture
def admin(db):
    return _make_user(db, "feraligart160@gmail.com", "Admin", "admin")


@pytest.fixture
def user(db):
    return _make_user(db, "estudiante@gmail.com", "Estudiante", "user")


@pytest.fixture
def admin_headers(admin):
    return {"Authorization": f"Bearer {create_access_token(admin)}"}


@pytest.fixture
def user_headers(user):
    return {"Authorization": f"Bearer {create_access_token(user)}"}
