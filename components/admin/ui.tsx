export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[0.875rem] border border-line bg-paper p-6 ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none";

export function SaveButton({ children = "Save Changes" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-ink hover:bg-[#ffc23d]"
    >
      {children}
    </button>
  );
}

export function DangerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
    >
      {children}
    </button>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-muted">
      {children}
    </div>
  );
}

export function HelpNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-ink">
      {children}
    </div>
  );
}
