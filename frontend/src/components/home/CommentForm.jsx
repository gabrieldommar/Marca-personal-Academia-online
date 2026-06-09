import { useState } from "react";

import Button from "../ui/Button";
import GoogleLoginButton from "../auth/GoogleLoginButton";
import { useAuth } from "../../hooks/useAuth";
import { commentService } from "../../services/commentService";

export default function CommentForm({ onSubmitted }) {
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-line bg-surface p-6">
        <p className="text-small text-muted">Inicia sesión para dejar un comentario.</p>
        <GoogleLoginButton label="Inicia sesión con Google para comentar" className="mt-4" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-lg border border-line bg-accent-soft p-6">
        <p className="text-small text-ink">
          ¡Gracias! Tu comentario quedó pendiente de aprobación.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("Escribe un comentario antes de enviar.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await commentService.create(body.trim());
      setBody("");
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-surface p-6">
      <label htmlFor="comment" className="text-small font-medium text-ink">
        Deja tu comentario
      </label>
      <textarea
        id="comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Comparte tu experiencia…"
        className="mt-2 w-full resize-y rounded-lg border border-line bg-paper p-3 text-body outline-none focus:border-accent"
      />
      {error && <p className="mt-2 text-small text-accent">{error}</p>}
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando…" : "Enviar comentario"}
        </Button>
      </div>
    </form>
  );
}
