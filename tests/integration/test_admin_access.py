"""Cubre explícitamente que un usuario no-admin (y uno sin sesión) no accede
a endpoints protegidos de administración."""


def test_non_admin_cannot_list_pending(client, user_headers):
    assert client.get("/api/comments/pending", headers=user_headers).status_code == 403


def test_unauthenticated_cannot_list_pending(client):
    assert client.get("/api/comments/pending").status_code == 403


def test_non_admin_cannot_create_collaboration(client, user_headers):
    r = client.post("/api/brand/collaborations", json={"name": "X"}, headers=user_headers)
    assert r.status_code == 403


def test_non_admin_cannot_create_course(client, user_headers):
    r = client.post(
        "/api/courses", json={"title": "T", "category": "medicina"}, headers=user_headers
    )
    assert r.status_code == 403


def test_non_admin_cannot_approve_comment(client, user_headers, admin_headers):
    # admin crea contexto: un comentario pendiente de otro usuario
    cid = client.post(
        "/api/comments", json={"body": "hola"}, headers=user_headers
    ).json()["id"]
    r = client.patch(f"/api/comments/{cid}/approve", headers=user_headers)
    assert r.status_code == 403


def test_collaboration_public_read_allowed(client):
    assert client.get("/api/brand/collaborations").status_code == 200
