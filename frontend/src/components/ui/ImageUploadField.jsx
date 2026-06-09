import { useState } from "react";

import { uploadService } from "../../services/uploadService";
import { mediaUrl } from "../../services/api";

// Campo de imagen: permite subir un archivo o pegar una URL. `value` es la URL
// resultante; `onChange` recibe la nueva URL (string), no un evento.
export function ImageUploadField({ label, value, onChange, className = "" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadService.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // permite re-subir el mismo archivo
    }
  };

  return (
    <div className={`block ${className}`}>
      <span className="block text-small font-medium text-ink">{label}</span>

      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <img
            src={mediaUrl(value)}
            alt=""
            referrerPolicy="no-referrer"
            className="h-12 w-12 rounded border border-line object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded border border-line bg-paper" />
        )}

        <label className="cursor-pointer rounded-lg border border-line px-3 py-2 text-small text-ink transition-colors hover:bg-accent-soft">
          {uploading ? "Subiendo…" : "Subir imagen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-small text-accent hover:underline"
          >
            Quitar
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="…o pega una URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-body outline-none focus:border-accent"
      />

      {error && <p className="mt-1 text-small text-accent">{error}</p>}
    </div>
  );
}
