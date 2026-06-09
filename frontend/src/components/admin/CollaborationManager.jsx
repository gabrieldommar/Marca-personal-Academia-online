import { useState } from "react";

import Button from "../ui/Button";
import { Field, TextAreaField } from "../ui/Form";
import { ImageUploadField } from "../ui/ImageUploadField";
import { Spinner, ErrorMessage, EmptyState } from "../ui/States";
import { useFetch } from "../../hooks/useFetch";
import { collaborationService } from "../../services/collaborationService";

const EMPTY = { name: "", logo_url: "", website_url: "", description: "" };

export default function CollaborationManager() {
  const { data, loading, error, reload } = useFetch(collaborationService.list);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setVal = (k) => (val) => setForm((f) => ({ ...f, [k]: val }));

  const create = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError("El nombre es obligatorio.");
    setSubmitting(true);
    setFormError(null);
    try {
      await collaborationService.create(form);
      setForm(EMPTY);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    await collaborationService.remove(id);
    reload();
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <form onSubmit={create} className="space-y-4 rounded-lg border border-line bg-surface p-6">
        <h3 className="text-h3">Nueva colaboración</h3>
        <Field label="Nombre" value={form.name} onChange={set("name")} />
        <ImageUploadField label="Logo" value={form.logo_url} onChange={setVal("logo_url")} />
        <Field label="Sitio web" value={form.website_url} onChange={set("website_url")} />
        <TextAreaField label="Descripción" rows={3} value={form.description} onChange={set("description")} />
        {formError && <p className="text-small text-accent">{formError}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando…" : "Agregar"}
        </Button>
      </form>

      <div>
        <h3 className="mb-4 text-h3">Colaboraciones</h3>
        {loading && <Spinner />}
        {error && <ErrorMessage message="No se pudieron cargar." />}
        {!loading && !error && (data.length ? (
          <ul className="space-y-2">
            {data.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3"
              >
                <span className="text-small">{c.name}</span>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="text-small text-accent hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Sin colaboraciones." />
        ))}
      </div>
    </div>
  );
}
