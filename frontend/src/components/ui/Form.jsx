const labelCls = "block text-small font-medium text-ink";
const inputCls =
  "mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-body outline-none focus:border-accent";

export function Field({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <input className={inputCls} {...props} />
    </label>
  );
}

export function TextAreaField({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <textarea className={`${inputCls} resize-y`} {...props} />
    </label>
  );
}

export function SelectField({ label, options, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <select className={inputCls} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({ label, className = "", ...props }) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <input type="checkbox" className="h-4 w-4 accent-accent" {...props} />
      <span className="text-small text-ink">{label}</span>
    </label>
  );
}
