import { api } from "./api";

export const courseService = {
  listAll: () => api.get("/courses"),
  listByCategory: (category) => api.get(`/courses/${category}`),
  getDetail: (category, slug) => api.get(`/courses/${category}/${slug}`),

  // Admin — cursos
  create: (data) => api.post("/courses", data, { auth: true }),
  update: (id, data) => api.patch(`/courses/${id}`, data, { auth: true }),
  remove: (id) => api.delete(`/courses/${id}`, { auth: true }),

  // Admin — contenido
  addContent: (courseId, data) =>
    api.post(`/courses/${courseId}/contents`, data, { auth: true }),
  updateContent: (id, data) => api.patch(`/contents/${id}`, data, { auth: true }),
  removeContent: (id) => api.delete(`/contents/${id}`, { auth: true }),

  // Admin — subida de archivo (PDF / video directo)
  upload: (file, kind = "pdf") => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/courses/upload?kind=${kind}`, form, { auth: true, isForm: true });
  },
};

export const CATEGORIES = [
  { slug: "ingreso-medicina", label: "Ingreso Medicina" },
  { slug: "medicina", label: "Medicina" },
  { slug: "programacion", label: "Programación" },
];

export const categoryLabel = (slug) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
