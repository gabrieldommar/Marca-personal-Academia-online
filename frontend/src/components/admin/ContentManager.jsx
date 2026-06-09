import { useState } from "react";

import Button from "../ui/Button";
import { Field, SelectField, CheckboxField } from "../ui/Form";
import { Spinner, ErrorMessage, EmptyState } from "../ui/States";
import { useFetch } from "../../hooks/useFetch";
import { courseService } from "../../services/courseService";

const EMPTY = { title: "", type: "pdf", provider: "youtube", url: "", embeddable: true };

const TYPE_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video" },
];
const PROVIDER_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "vimeo", label: "Vimeo" },
  { value: "direct", label: "Archivo directo" },
];

export default function ContentManager({ course }) {
  const { data, loading, error, reload } = useFetch(
    () => courseService.getDetail(course.category, course.slug),
    [course.id]
  );
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isVideo = form.type === "video";

  const uploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setFormError(null);
    try {
      const kind = isVideo ? "video" : "pdf";
      const { url } = await courseService.upload(file, kind);
      setForm((f) => ({ ...f, url }));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      return setFormError("Título y URL/archivo son obligatorios.");
    }
    const payload = {
      title: form.title,
      type: form.type,
      url: form.url,
      provider: isVideo ? form.provider : null,
      embeddable: isVideo ? form.embeddable : true,
    };
    setBusy(true);
    setFormError(null);
    try {
      await courseService.addContent(course.id, payload);
      setForm(EMPTY);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeContent = async (id) => {
    await courseService.removeContent(id);
    reload();
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-8 border-t border-line pt-6 lg:grid-cols-2">
      <form onSubmit={add} className="space-y-4">
        <h4 className="text-small font-medium uppercase tracking-wide text-muted">
          Agregar contenido
        </h4>
        <Field label="Título" value={form.title} onChange={set("title")} />
        <SelectField label="Tipo" options={TYPE_OPTIONS} value={form.type} onChange={set("type")} />
        {isVideo && (
          <SelectField
            label="Proveedor"
            options={PROVIDER_OPTIONS}
            value={form.provider}
            onChange={set("provider")}
          />
        )}
        <Field
          label={isVideo ? "URL del video (o sube un archivo)" : "URL del PDF (o sube un archivo)"}
          value={form.url}
          onChange={set("url")}
          placeholder="https://…"
        />
        <label className="block text-small text-muted">
          Subir archivo ({isVideo ? "video" : "pdf"})
          <input
            type="file"
            accept={isVideo ? "video/*" : "application/pdf"}
            onChange={uploadFile}
            className="mt-1 block w-full text-small"
          />
        </label>
        {isVideo && (
          <CheckboxField
            label="Embebible (si se desmarca, se muestra enlace a la plataforma)"
            checked={form.embeddable}
            onChange={(e) => setForm((f) => ({ ...f, embeddable: e.target.checked }))}
          />
        )}
        {formError && <p className="text-small text-accent">{formError}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? "Procesando…" : "Agregar contenido"}
        </Button>
      </form>

      <div>
        <h4 className="mb-3 text-small font-medium uppercase tracking-wide text-muted">
          Contenido actual
        </h4>
        {loading && <Spinner />}
        {error && <ErrorMessage message="No se pudo cargar el contenido." />}
        {!loading && !error && (data.contents.length ? (
          <ul className="space-y-2">
            {data.contents.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-line bg-paper px-3 py-2"
              >
                <span className="truncate text-small">
                  {c.type === "video" ? "▶" : "▤"} {c.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeContent(c.id)}
                  className="text-small text-accent hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Sin contenido todavía." />
        ))}
      </div>
    </div>
  );
}
