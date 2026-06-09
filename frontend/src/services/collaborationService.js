import { api } from "./api";

export const collaborationService = {
  list: () => api.get("/brand/collaborations"),

  // Admin
  create: (data) => api.post("/brand/collaborations", data, { auth: true }),
  update: (id, data) => api.patch(`/brand/collaborations/${id}`, data, { auth: true }),
  remove: (id) => api.delete(`/brand/collaborations/${id}`, { auth: true }),
};
