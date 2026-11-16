import Link from "next/link";

type Variant = "primary" | "outline" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-all duration-300 active:scale-[0.97] disabled:opacity-60 " +
  "disabled:pointer-events-none";

const VARIANTS: Record<Variant, string> = {
  // Gold fill, ink text — the single highest-priority action on any screen.
  primary:
    "bg-gold text-ink hover:bg-[#ffc23d] shadow-[0_8px_24px_-8px_rgba(248,176,24,0.65)] hover:shadow-[0_14px_34px_-10px_rgba(248,176,24,0.75)] hover:-translate-y-0.5",
  outline:
    "border border-ink/15 text-ink hover:border-gold hover:bg-gold-soft hover:-translate-y-0.5",
  ghost: "text-ink hover:bg-paper-sunk",
  // For use on the near-black sections
  onDark:
    "border border-white/25 text-paper hover:border-gold hover:bg-white/10 hover:-translate-y-0.5",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm tracking-wide",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
