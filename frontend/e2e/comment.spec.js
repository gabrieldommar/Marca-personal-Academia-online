import { test, expect } from "@playwright/test";

// Mocks comunes para que la home cargue sin backend real.
async function mockHome(page, { approved = [] } = {}) {
  await page.route("**/api/brand/collaborations", (r) => r.fulfill({ json: [] }));
  await page.route("**/api/courses", (r) => r.fulfill({ json: [] }));
  await page.route("**/api/comments/approved", (r) => r.fulfill({ json: approved }));
}

const userInfo = {
  id: 1,
  email: "estudiante@gmail.com",
  name: "Estudiante",
  picture: null,
  role: "user",
  is_admin: false,
  created_at: "2026-01-01T00:00:00",
};

test("sin sesión, el formulario muestra el login con Google", async ({ page }) => {
  await mockHome(page);
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /Inicia sesión con Google para comentar/i })
  ).toBeVisible();
});

test("muestra los comentarios aprobados existentes", async ({ page }) => {
  await mockHome(page, {
    approved: [
      { id: 1, body: "Curso excelente", created_at: "2026-01-01T00:00:00", author: { name: "Ana", picture: null } },
    ],
  });
  await page.goto("/");
  await expect(page.getByText("Curso excelente", { exact: false })).toBeVisible();
});

test("usuario autenticado (Google mockeado) envía comentario y ve aviso de pendiente", async ({ page }) => {
  // Simula la sesión Google: token en localStorage + /auth/me mockeado.
  await page.addInitScript(() => localStorage.setItem("auth_token", "fake-token"));
  await page.route("**/api/auth/me", (r) => r.fulfill({ json: userInfo }));
  await mockHome(page);
  await page.route("**/api/comments", (route) => {
    if (route.request().method() === "POST") {
      return route.fulfill({
        status: 201,
        json: { id: 5, body: "Gran clase", status: "pending", created_at: "2026-01-01T00:00:00", author: { name: "Estudiante" } },
      });
    }
    return route.continue();
  });

  await page.goto("/");
  await page.getByPlaceholder(/Comparte tu experiencia/i).fill("Gran clase");
  await page.getByRole("button", { name: /Enviar comentario/i }).click();
  await expect(page.getByText(/pendiente de aprobación/i)).toBeVisible();
});
