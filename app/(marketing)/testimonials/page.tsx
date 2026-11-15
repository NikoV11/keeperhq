import { Section, SectionHeading } from "@/components/section";
import { MediaImage } from "@/components/media-image";
import { getTestimonials } from "@/lib/content";
import { publicMediaUrl } from "@/lib/media";

export const metadata = { title: "Testimonials | KeeperHQ" };

export default async function TestimonialsPage() {
  const [videos, written] = await Promise.all([
    getTestimonials("video"),
    getTestimonials("written"),
  ]);

  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Testimonials"
          title="Goalkeeper & parent testimonials"
          subtitle="What goalkeepers and families say about training with KeeperHQ."
        />
        {videos.length === 0 ? (
          <p className="text-sm text-brand-gray">Video testimonials coming soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((t) => {
              const videoUrl = publicMediaUrl(t.video_path);
              return (
                <div key={t.id} className="rounded-xl border border-gray-200 p-5">
                  {videoUrl ? (
                    <video
                      controls
                      preload="metadata"
                      poster={publicMediaUrl(t.thumbnail_path) ?? undefined}
                      className="mb-3 aspect-video w-full rounded-lg bg-black"
                    >
                      <source src={videoUrl} />
                    </video>
                  ) : (
                    <MediaImage
                      path={t.thumbnail_path}
                      alt={t.name}
                      className="mb-3 aspect-video w-full rounded-lg object-cover"
                    />
                  )}
                  <p className="font-semibold text-brand-black">
                    {t.name}
                    {t.age && <span className="font-normal text-brand-gray">, {t.age}</span>}
                  </p>
                  <p className="text-sm text-brand-gray">{t.affiliation}</p>
                  {t.quote && <p className="mt-2 text-sm text-brand-gray">&ldquo;{t.quote}&rdquo;</p>}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {written.length > 0 && (
        <Section className="bg-brand-gray-light">
          <SectionHeading title="Written testimonials" subtitle="Prefer to read rather than watch?" />
          <div className="grid gap-4 sm:grid-cols-2">
            {written.map((t) => (
              <blockquote key={t.id} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-brand-black">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-3 text-sm font-semibold text-brand-black">
                  {t.name}
                  {t.affiliation && (
                    <span className="font-normal text-brand-gray"> — {t.affiliation}</span>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
