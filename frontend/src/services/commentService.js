import { api } from "./api";

export const commentService = {
  listApproved: () => api.get("/comments/approved"),
  create: (body) => api.post("/comments", { body }, { auth: true }),

  // Admin
  listPending: () => api.get("/comments/pending", { auth: true }),
  approve: (id) => api.patch(`/comments/${id}/approve`, null, { auth: true }),
  reject: (id) => api.patch(`/comments/${id}/reject`, null, { auth: true }),
};
