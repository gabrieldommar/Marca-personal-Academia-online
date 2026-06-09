import { api } from "./api";

export const uploadService = {
  // Sube una imagen (portada de curso / logo de colaboración) y devuelve { url }.
  uploadImage: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/courses/upload?kind=image", form, { auth: true, isForm: true });
  },
};
