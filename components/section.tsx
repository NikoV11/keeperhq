import { Reveal } from "@/components/reveal";

type Tone = "light" | "warm" | "dark";

const TONES: Record<Tone, string> = {
  light: "bg-paper text-ink",
  warm: "bg-paper-warm text-ink",
  dark: "bg-ink text-paper",
};

export function Section({
  id,
  tone = "light",
  compact = false,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  /** Less vertical padding — for intro blocks that only carry a heading. */
  compact?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${TONES[tone]} ${className}`}>
      <div
        className={`mx-auto max-w-7xl px-5 ${
          compact ? "py-12 sm:py-16" : "py-20 sm:py-28"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-dark">
          <span aria-hidden className="inline-block h-px w-6 bg-gold" />
          <span className={dark ? "text-gold" : undefined}>{eyebrow}</span>
        </p>
      )}
      <h2 className="text-[clamp(1.5rem,4.5vw,2.75rem)] font-extrabold leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-paper/70" : "text-ink-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
