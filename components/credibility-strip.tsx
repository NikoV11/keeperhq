/**
 * Clubs and competitions that appear in the supplied testimonials — these are the
 * backgrounds of goalkeepers and coaches Stefan has worked with, not endorsements
 * by the clubs. The heading above the strip says so explicitly; keep that wording
 * if you edit this list.
 */
const AFFILIATIONS = [
  "FC Ingolstadt 04",
  "Paris 2024 Olympics",
  "Real Madrid C.F.",
  "Paris Saint-Germain",
  "FIFA U20 World Cup",
  "Bayern Munich",
  "1. FC Nürnberg",
  "Corinthians",
  "NCAA Division III Champion",
  "RB Leipzig",
  "S.S. Lazio",
  "Regionalliga Bayern",
  "RCD Espanyol",
  "FC Dallas",
  "Germany Youth National Teams",
  "NAIA National Tournament",
];

export function CredibilityStrip() {
  // Rendered twice so the marquee can loop seamlessly at -50%.
  const items = [...AFFILIATIONS, ...AFFILIATIONS];

  return (
    <section className="border-y border-white/10 bg-ink py-7 text-paper">
      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        Goalkeepers and coaches we have worked with have come through
      </p>

      <div
        className="kh-marquee relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <ul className="kh-marquee-track flex w-max items-center gap-10 pr-10">
          {items.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= AFFILIATIONS.length}
              className="whitespace-nowrap text-sm font-semibold tracking-wide text-paper/70"
            >
              {name}
              <span className="ml-10 text-gold" aria-hidden>
                ◆
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
