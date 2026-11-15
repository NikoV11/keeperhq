import { Section, SectionHeading } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial-card";
import { MediaImage } from "@/components/media-image";
import { getTestimonials } from "@/lib/content";
import { publicMediaUrl } from "@/lib/media";
import type { Testimonial } from "@/lib/content";

export const metadata = { title: "Testimonials | KeeperHQ" };

const GROUPS: { category: Testimonial["category"]; title: string; subtitle: string }[] = [
  {
    category: "goalkeeper",
    title: "Goalkeepers",
    subtitle: "From academy professionals and internationals to college and high-school keepers.",
  },
  {
    category: "coach",
    title: "Coaches",
    subtitle: "Head coaches, academy directors, and goalkeeper coaches we've worked alongside.",
  },
  {
    category: "parent",
    title: "Parents",
    subtitle: "Families on what changed for their goalkeeper.",
  },
];

export default async function TestimonialsPage() {
  const all = await getTestimonials();
  const videos = all.filter((t) => t.kind === "video");

  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Testimonials & References"
          title="What goalkeepers, coaches, and families say"
          subtitle="Testimonials retain the wording they were submitted in."
        />
        <div className="flex flex-wrap gap-6 text-sm">
          {GROUPS.map((g) => {
            const count = all.filter((t) => t.category === g.category && t.kind === "written").length;
            return (
              <a key={g.category} href={`#${g.category}`} className="font-medium text-brand-green hover:underline">
                {count} {g.title.toLowerCase()}
              </a>
            );
          })}
        </div>
      </Section>

      {videos.length > 0 && (
        <Section className="bg-brand-gray-light">
          <SectionHeading title="Video testimonials" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((t) => {
              const videoUrl = publicMediaUrl(t.video_path);
              return (
                <div key={t.id} className="rounded-xl bg-white p-5 shadow-sm">
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
                      path={t.thumbnail_path ?? t.photo_path}
                      alt={t.name}
                      className="mb-3 aspect-video w-full rounded-lg object-cover"
                    />
                  )}
                  <p className="font-semibold text-brand-black">{t.name}</p>
                  <p className="text-sm text-brand-gray">{t.affiliation ?? t.profile[0]}</p>
                  {t.quote && <p className="mt-2 text-sm text-brand-gray">&ldquo;{t.quote}&rdquo;</p>}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {GROUPS.map((group, i) => {
        const items = all.filter(
          (t) => t.category === group.category && t.kind === "written"
        );
        if (items.length === 0) return null;

        return (
          <Section
            key={group.category}
            id={group.category}
            className={i % 2 === 0 ? "" : "bg-brand-gray-light"}
          >
            <SectionHeading title={group.title} subtitle={group.subtitle} />
            <div className="grid items-start gap-5 lg:grid-cols-2">
              {items.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
