import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: false,
    timeout: 120000,
    // API same-origin en e2e: las peticiones van a 5173/api y las intercepta
    // page.route sin problemas de CORS (no hay backend real en estas pruebas).
    env: { VITE_API_URL: "/api" },
  },
});
