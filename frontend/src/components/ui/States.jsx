export function Spinner({ label = "Cargando…" }) {
  return <p className="py-8 text-small text-muted">{label}</p>;
}

export function ErrorMessage({ message = "Algo salió mal." }) {
  return <p className="py-8 text-small text-accent">{message}</p>;
}

export function EmptyState({ message = "Nada por aquí todavía." }) {
  return <p className="py-8 text-small text-muted">{message}</p>;
}

export function SectionHeading({ overline, title, children }) {
  return (
    <div className="mb-10">
      {overline && (
        <span className="font-mono text-small text-accent">
          {overline}
        </span>
      )}
      <h2 className="mt-2 text-h2">{title}</h2>
      {children && <p className="mt-3 max-w-2xl text-muted">{children}</p>}
    </div>
  );
}
