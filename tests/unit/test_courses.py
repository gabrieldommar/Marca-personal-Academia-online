def test_public_list_empty(client):
    r = client.get("/api/courses")
    assert r.status_code == 200
    assert r.json() == []


def test_invalid_category_returns_422(client):
    r = client.get("/api/courses/categoria-inexistente")
    assert r.status_code == 422


def test_create_course_requires_admin(client, user_headers):
    r = client.post(
        "/api/courses",
        json={"title": "T", "category": "medicina"},
        headers=user_headers,
    )
    assert r.status_code == 403


def test_create_course_unauthenticated(client):
    r = client.post("/api/courses", json={"title": "T", "category": "medicina"})
    assert r.status_code == 403


def test_create_course_admin_generates_slug(client, admin_headers):
    r = client.post(
        "/api/courses",
        json={"title": "Python Basico", "category": "programacion"},
        headers=admin_headers,
    )
    assert r.status_code == 201
    assert r.json()["slug"] == "python-basico"


def test_create_course_validation_error(client, admin_headers):
    # category inválida → 422 de Pydantic
    r = client.post(
        "/api/courses",
        json={"title": "X", "category": "nope"},
        headers=admin_headers,
    )
    assert r.status_code == 422


def test_content_video_requires_provider(client, admin_headers):
    course = client.post(
        "/api/courses",
        json={"title": "Curso", "category": "programacion"},
        headers=admin_headers,
    ).json()
    r = client.post(
        f"/api/courses/{course['id']}/contents",
        json={"title": "Clase", "type": "video", "url": "http://x", "provider": None},
        headers=admin_headers,
    )
    assert r.status_code == 400


def test_detail_lists_content(client, admin_headers):
    course = client.post(
        "/api/courses",
        json={"title": "Curso Med", "category": "medicina"},
        headers=admin_headers,
    ).json()
    client.post(
        f"/api/courses/{course['id']}/contents",
        json={
            "title": "Video 1",
            "type": "video",
            "provider": "youtube",
            "url": "https://youtu.be/abc12345678",
            "embeddable": True,
        },
        headers=admin_headers,
    )
    r = client.get(f"/api/courses/medicina/{course['slug']}")
    assert r.status_code == 200
    assert len(r.json()["contents"]) == 1
