import { api } from "./api";

export const authService = {
  me: () => api.get("/auth/me", { auth: true }),
};
