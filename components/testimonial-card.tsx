import { MediaImage } from "@/components/media-image";
import type { Testimonial } from "@/lib/content";

/** Splits a stored quote back into the paragraphs it was written in. */
function paragraphs(quote: string) {
  return quote.split(/\n\s*\n/).filter(Boolean);
}

export function TestimonialCard({
  testimonial,
  dark = false,
  showProfile = true,
}: {
  testimonial: Testimonial;
  dark?: boolean;
  showProfile?: boolean;
}) {
  const t = testimonial;
  const muted = dark ? "text-paper/50" : "text-ink-muted";
  const body = dark ? "text-paper/75" : "text-ink-muted";

  return (
    <figure
      className={`kh-lift flex h-full flex-col rounded-[1.25rem] p-6 ${
        dark
          ? "border border-white/10 bg-white/[0.04] hover:border-gold/40"
          : "border border-line bg-paper hover:border-gold/60"
      }`}
    >
      <div className="flex items-center gap-4">
        <MediaImage
          path={t.photo_path}
          alt={t.name}
          className={`h-16 w-16 shrink-0 rounded-full object-cover ring-2 ${
            dark ? "ring-gold/30" : "ring-gold/40"
          }`}
        />
        <figcaption>
          <p className={`font-bold ${dark ? "text-paper" : "text-ink"}`}>
            {t.name}
            {t.age ? <span className={`font-normal ${muted}`}>, {t.age}</span> : null}
          </p>
          {t.profile.length > 0 && <p className={`text-sm ${muted}`}>{t.profile[0]}</p>}
        </figcaption>
      </div>

      {t.quote ? (
        <blockquote className={`mt-4 space-y-2 text-sm ${body}`}>
          {paragraphs(t.quote).map((p, i) => (
            <p key={i}>{i === 0 ? `“${p}` : p}{i === paragraphs(t.quote!).length - 1 ? "”" : ""}</p>
          ))}
        </blockquote>
      ) : (
        <p className={`mt-4 text-sm italic ${muted}`}>Testimonial coming soon.</p>
      )}

      {t.quote_original && (
        <details className="mt-3">
          <summary className={`cursor-pointer text-xs font-bold ${dark ? "text-gold" : "text-gold-dark"}`}>
            Read the original {t.quote_original_language}
          </summary>
          <p className={`mt-2 whitespace-pre-wrap text-sm italic ${body}`}>{t.quote_original}</p>
        </details>
      )}

      {showProfile && t.profile.length > 1 && (
        <details className="mt-3">
          <summary className={`cursor-pointer text-xs font-bold ${dark ? "text-gold" : "text-gold-dark"}`}>
            Background &amp; career
          </summary>
          <ul className={`mt-2 list-disc space-y-1.5 pl-5 text-sm ${body}`}>
            {t.profile.slice(1).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </details>
      )}
    </figure>
  );
}
