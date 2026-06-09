def test_full_moderation_flow(client, user_headers, admin_headers):
    # 1. approved vacío al inicio
    assert client.get("/api/comments/approved").json() == []

    # 2. usuario autenticado envía un comentario → queda pending
    created = client.post("/api/comments", json={"body": "Excelente curso"}, headers=user_headers)
    assert created.status_code == 201
    cid = created.json()["id"]
    assert created.json()["status"] == "pending"

    # 3. todavía no aparece en público
    assert client.get("/api/comments/approved").json() == []

    # 4. admin lo ve en pending
    pending = client.get("/api/comments/pending", headers=admin_headers)
    assert pending.status_code == 200
    assert len(pending.json()) == 1

    # 5. admin aprueba
    approved = client.patch(f"/api/comments/{cid}/approve", headers=admin_headers)
    assert approved.status_code == 200
    assert approved.json()["status"] == "approved"

    # 6. ahora sí es público y no expone el email del autor
    public = client.get("/api/comments/approved").json()
    assert len(public) == 1
    assert public[0]["body"] == "Excelente curso"
    assert "email" not in public[0]["author"]


def test_reject_keeps_comment_out_of_public(client, user_headers, admin_headers):
    cid = client.post("/api/comments", json={"body": "spam"}, headers=user_headers).json()["id"]
    rejected = client.patch(f"/api/comments/{cid}/reject", headers=admin_headers)
    assert rejected.status_code == 200
    assert rejected.json()["status"] == "rejected"
    assert client.get("/api/comments/approved").json() == []


def test_post_comment_requires_authentication(client):
    r = client.post("/api/comments", json={"body": "x"})
    assert r.status_code == 403


def test_post_comment_validates_body(client, user_headers):
    r = client.post("/api/comments", json={"body": ""}, headers=user_headers)
    assert r.status_code == 422
