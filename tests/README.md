# Tests

```
tests/
  conftest.py            # fixtures: DB SQLite en memoria, client, usuarios admin/normal, tokens
  unit/                  # auth, rol admin, validación de endpoints
  integration/           # flujo de moderación de comentarios, control de acceso admin
  e2e/                   # Playwright (Bloque 10)
```

## Backend (pytest + httpx)

Usa el venv del backend (donde están FastAPI/httpx) y pytest.

```bash
# desde la raíz del proyecto
backend\.venv\Scripts\python -m pip install -r tests\requirements.txt
backend\.venv\Scripts\python -m pytest tests\unit tests\integration -v
```

- Google OAuth está **mockeado** (`test_auth.py` → `FakeGoogle`); no se usan credenciales reales.
- Cada test corre contra una base SQLite en memoria que se crea y destruye por test.
- Cobertura clave:
  - Asignación de rol admin por email (unit).
  - No-admin / sin sesión → 403 en endpoints de administración (`test_admin_access.py`).
  - Flujo completo de comentario: envío → pending → aprobación → visible (`test_comment_flow.py`).

## Frontend (Vitest + RTL + Playwright)

Por requerir el toolchain de Vite, los tests de frontend viven dentro de `frontend/`:
- **Unit (Vitest + RTL):** `frontend/src/**/*.test.jsx` (CourseCard, VideoPlayer, CommentForm).
- **E2E (Playwright):** `frontend/e2e/*.spec.js`.

```bash
cd frontend
npm install
npm run test                 # unit (Vitest)
npx playwright install chromium
npm run test:e2e             # e2e (Playwright)
```

- Google OAuth se mockea inyectando el token en `localStorage` e interceptando `/auth/me` (sin credenciales reales).
- En e2e el backend se mockea con `page.route`; el dev server corre con `VITE_API_URL=/api` (same-origin) para evitar CORS en los mocks.
- Cobertura e2e: login contextual, envío de comentario → aviso de pendiente, visualización de aprobados, moderación admin y bloqueo de `/admin` a no-admins.
