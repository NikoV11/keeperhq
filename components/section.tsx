export function Section({
  id,
  dark = false,
  className = "",
  children,
}: {
  id?: string;
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${dark ? "bg-brand-black text-brand-white" : "bg-white text-brand-black"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-green-light">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 ${dark ? "text-gray-300" : "text-brand-gray"}`}>{subtitle}</p>
      )}
    </div>
  );
}
