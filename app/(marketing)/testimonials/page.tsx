import { Section, SectionHeading } from "@/components/section";
import { VIDEO_TESTIMONIALS, WRITTEN_TESTIMONIALS } from "@/content/testimonials";

export const metadata = { title: "Testimonials | KeeperHQ" };

export default function TestimonialsPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Testimonials"
          title="Goalkeeper & parent testimonials"
          subtitle="What goalkeepers and families say about training with KeeperHQ."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_TESTIMONIALS.map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-200 p-5">
              <div className="mb-3 aspect-video rounded-lg bg-brand-gray-light" />
              <p className="font-semibold text-brand-black">{t.name}</p>
              <p className="text-sm text-brand-gray">{t.affiliation}</p>
              {t.quote && <p className="mt-2 text-sm text-brand-gray">&ldquo;{t.quote}&rdquo;</p>}
              <button
                disabled
                className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-brand-gray"
              >
                WATCH TESTIMONIAL
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-gray-light">
        <SectionHeading title="Written testimonials" subtitle="Prefer to read rather than watch?" />
        <div className="grid gap-4 sm:grid-cols-2">
          {WRITTEN_TESTIMONIALS.map((t) => (
            <blockquote key={t.id} className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-brand-black">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-3 text-sm font-semibold text-brand-black">
                {t.name}
                <span className="font-normal text-brand-gray"> — {t.affiliation}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>
    </>
  );
}
