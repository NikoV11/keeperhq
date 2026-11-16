import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";
import { MediaImage } from "@/components/media-image";
import { getTeamMembers } from "@/lib/content";

export const metadata = { title: "About Us | KeeperHQ" };

export default async function AboutPage() {
  const team = await getTeamMembers();

  return (
    <Section>
      <SectionHeading
        eyebrow="About Us"
        title="Meet the KeeperHQ team"
        subtitle="Goalkeeper coaches and a dedicated strength and conditioning specialist, focused entirely on goalkeeper development."
      />
      {team.length === 0 ? (
        <p className="text-sm text-ink-muted">Team profiles coming soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.id} className="kh-lift rounded-[0.875rem] border border-line bg-paper p-5">
              <MediaImage
                path={member.photo_path}
                alt={member.name}
                className="mb-4 aspect-square w-full rounded-lg object-cover"
              />
              <p className="font-semibold text-ink">{member.name}</p>
              <p className="text-sm text-gold-dark">{member.role_title}</p>
              <p className="mt-2 text-sm text-ink-muted">{member.short_bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/about/${member.slug}`}
                  className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-ink hover:bg-[#ffc23d]"
                >
                  Full Profile
                </Link>
                {member.slug === "paul" && (
                  <Link
                    href="/strength-conditioning"
                    className="rounded-full border border-gold px-3 py-1.5 text-xs font-semibold text-gold-dark hover:bg-gold hover:text-ink"
                  >
                    View S&C Programs
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
