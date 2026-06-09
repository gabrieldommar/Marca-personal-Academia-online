const VARIANTS = {
  primary: "bg-accent text-white font-semibold hover:bg-accent/90 border-transparent",
  outline: "bg-transparent text-ink hover:bg-accent-soft border-line",
  ghost: "bg-transparent text-muted hover:text-ink border-transparent",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-small font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
