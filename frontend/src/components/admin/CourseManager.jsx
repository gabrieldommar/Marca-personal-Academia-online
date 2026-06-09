import { useState } from "react";

import Button from "../ui/Button";
import { Field, TextAreaField, SelectField } from "../ui/Form";
import { ImageUploadField } from "../ui/ImageUploadField";
import { Spinner, ErrorMessage, EmptyState } from "../ui/States";
import { useFetch } from "../../hooks/useFetch";
import { courseService, CATEGORIES, categoryLabel } from "../../services/courseService";
import ContentManager from "./ContentManager";

const EMPTY = { title: "", category: CATEGORIES[0].slug, description: "", price: "", cover_image: "" };
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));

function CourseRow({ course, expanded, onToggle, onDelete }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-small text-accent">{categoryLabel(course.category)}</span>
          <h3 className="text-h3">{course.title}</h3>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onToggle} className="text-small text-muted hover:text-ink">
            {expanded ? "Cerrar" : "Contenido"}
          </button>
          <button type="button" onClick={onDelete} className="text-small text-accent hover:underline">
            Eliminar
          </button>
        </div>
      </div>
      {expanded && <ContentManager course={course} />}
    </div>
  );
}

export default function CourseManager() {
  const { data, loading, error, reload } = useFetch(courseService.listAll);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setVal = (k) => (val) => setForm((f) => ({ ...f, [k]: val }));

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setFormError("El título es obligatorio.");
    setSubmitting(true);
    setFormError(null);
    try {
      await courseService.create({
        title: form.title,
        category: form.category,
        description: form.description || null,
        cover_image: form.cover_image || null,
        price: form.price === "" ? null : Number(form.price),
      });
      setForm(EMPTY);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    await courseService.remove(id);
    if (expandedId === id) setExpandedId(null);
    reload();
  };

  return (
    <div className="space-y-10">
      <form onSubmit={create} className="grid grid-cols-1 gap-4 rounded-lg border border-line bg-surface p-6 sm:grid-cols-2">
        <h3 className="text-h3 sm:col-span-2">Nuevo curso</h3>
        <Field label="Título" value={form.title} onChange={set("title")} />
        <SelectField label="Categoría" options={CATEGORY_OPTIONS} value={form.category} onChange={set("category")} />
        <Field label="Precio (opcional)" type="number" min="0" value={form.price} onChange={set("price")} />
        <ImageUploadField label="Imagen de portada" value={form.cover_image} onChange={setVal("cover_image")} />
        <TextAreaField
          label="Descripción"
          rows={3}
          value={form.description}
          onChange={set("description")}
          className="sm:col-span-2"
        />
        {formError && <p className="text-small text-accent sm:col-span-2">{formError}</p>}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creando…" : "Crear curso"}
          </Button>
        </div>
      </form>

      <div>
        <h3 className="mb-4 text-h3">Cursos</h3>
        {loading && <Spinner />}
        {error && <ErrorMessage message="No se pudieron cargar los cursos." />}
        {!loading && !error && (data.length ? (
          <div className="space-y-4">
            {data.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                expanded={expandedId === course.id}
                onToggle={() => setExpandedId((id) => (id === course.id ? null : course.id))}
                onDelete={() => remove(course.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Aún no hay cursos." />
        ))}
      </div>
    </div>
  );
}
