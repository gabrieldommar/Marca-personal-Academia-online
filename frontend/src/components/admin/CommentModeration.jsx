import { useState } from "react";

import Button from "../ui/Button";
import { Spinner, ErrorMessage, EmptyState } from "../ui/States";
import { useFetch } from "../../hooks/useFetch";
import { commentService } from "../../services/commentService";

function PendingComment({ comment, onResolved }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const act = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      await fn(comment.id);
      onResolved();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <p className="text-body text-ink">“{comment.body}”</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-small text-muted">{comment.author.name}</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={busy} onClick={() => act(commentService.reject)}>
            Rechazar
          </Button>
          <Button disabled={busy} onClick={() => act(commentService.approve)}>
            Aprobar
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-small text-accent">{error}</p>}
    </div>
  );
}

export default function CommentModeration() {
  const { data, loading, error, reload } = useFetch(commentService.listPending);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message="No se pudieron cargar los comentarios pendientes." />;
  if (!data.length) return <EmptyState message="No hay comentarios pendientes." />;

  return (
    <div className="space-y-4">
      {data.map((c) => (
        <PendingComment key={c.id} comment={c} onResolved={reload} />
      ))}
    </div>
  );
}
