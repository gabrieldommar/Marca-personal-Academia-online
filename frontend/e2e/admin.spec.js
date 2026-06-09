import { test, expect } from "@playwright/test";

const adminInfo = {
  id: 1,
  email: "feraligart160@gmail.com",
  name: "Admin",
  picture: null,
  role: "admin",
  is_admin: true,
  created_at: "2026-01-01T00:00:00",
};

const userInfo = { ...adminInfo, email: "estudiante@gmail.com", name: "Estudiante", role: "user", is_admin: false };

test("usuario no-admin es redirigido fuera de /admin", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("auth_token", "user-token"));
  await page.route("**/api/auth/me", (r) => r.fulfill({ json: userInfo }));
  await page.goto("/admin");
  // RequireAdmin redirige al home → no debe verse el título del panel.
  await expect(page.getByRole("heading", { name: "Panel de administración" })).toHaveCount(0);
});

test("admin aprueba un comentario pendiente y desaparece de la lista", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("auth_token", "admin-token"));
  await page.route("**/api/auth/me", (r) => r.fulfill({ json: adminInfo }));

  let approved = false;
  await page.route("**/api/comments/pending", (r) =>
    r.fulfill({
      json: approved
        ? []
        : [{ id: 9, body: "Comentario pendiente", status: "pending", created_at: "2026-01-01T00:00:00", author: { name: "Ana" } }],
    })
  );
  await page.route("**/api/comments/9/approve", (r) => {
    approved = true;
    return r.fulfill({
      json: { id: 9, body: "Comentario pendiente", status: "approved", created_at: "2026-01-01T00:00:00", author: { name: "Ana" } },
    });
  });

  await page.goto("/admin");
  await expect(page.getByText("Comentario pendiente", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Aprobar" }).click();
  await expect(page.getByText("No hay comentarios pendientes.")).toBeVisible();
});
