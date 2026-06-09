from app.config import settings
from app.services.auth_service import get_or_create_user
from app import oauth as oauth_module


def test_admin_role_for_admin_email(db):
    u = get_or_create_user(db, email=settings.admin_email, name="A", picture=None)
    assert u.role == "admin"
    assert u.is_admin is True


def test_user_role_for_other_email(db):
    u = get_or_create_user(db, email="otro@gmail.com", name="Otro", picture=None)
    assert u.role == "user"
    assert u.is_admin is False


def test_get_or_create_is_idempotent_and_updates(db):
    a = get_or_create_user(db, email="x@y.com", name="X", picture=None)
    b = get_or_create_user(db, email="x@y.com", name="X2", picture="pic")
    assert a.id == b.id
    assert b.name == "X2"
    assert b.picture == "pic"


def test_me_returns_is_admin(client, admin_headers):
    r = client.get("/api/auth/me", headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["is_admin"] is True


def test_me_requires_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 403  # HTTPBearer sin header


def test_me_invalid_token(client):
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer no-valido"})
    assert r.status_code == 401


def test_oauth_callback_mocked_creates_user_and_redirects(client, monkeypatch):
    """Mock del proveedor Google: no se usan credenciales reales."""

    class FakeGoogle:
        async def authorize_access_token(self, request):
            return {
                "userinfo": {
                    "email": "feraligart160@gmail.com",
                    "name": "Admin",
                    "picture": None,
                }
            }

    monkeypatch.setattr(oauth_module.oauth, "google", FakeGoogle())
    r = client.get("/api/auth/callback", follow_redirects=False)
    assert r.status_code in (302, 307)
    assert "token=" in r.headers["location"]
