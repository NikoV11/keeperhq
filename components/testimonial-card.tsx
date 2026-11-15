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
  const muted = dark ? "text-gray-400" : "text-brand-gray";
  const body = dark ? "text-gray-300" : "text-brand-gray";

  return (
    <figure
      className={`flex h-full flex-col rounded-xl p-5 ${
        dark ? "bg-white/5" : "border border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <MediaImage
          path={t.photo_path}
          alt={t.name}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
        <figcaption>
          <p className={`font-semibold ${dark ? "text-white" : "text-brand-black"}`}>
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
          <summary className={`cursor-pointer text-xs font-medium ${dark ? "text-brand-green-light" : "text-brand-green"}`}>
            Read the original {t.quote_original_language}
          </summary>
          <p className={`mt-2 whitespace-pre-wrap text-sm italic ${body}`}>{t.quote_original}</p>
        </details>
      )}

      {showProfile && t.profile.length > 1 && (
        <details className="mt-3">
          <summary className={`cursor-pointer text-xs font-medium ${dark ? "text-brand-green-light" : "text-brand-green"}`}>
            Background &amp; career
          </summary>
          <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm ${body}`}>
            {t.profile.slice(1).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </details>
      )}
    </figure>
  );
}
