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
        <p className="text-sm text-brand-gray">Team profiles coming soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.id} className="rounded-xl border border-gray-200 p-5">
              <MediaImage
                path={member.photo_path}
                alt={member.name}
                className="mb-4 aspect-square w-full rounded-lg object-cover"
              />
              <p className="font-semibold text-brand-black">{member.name}</p>
              <p className="text-sm text-brand-green">{member.role_title}</p>
              <p className="mt-2 text-sm text-brand-gray">{member.short_bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/about/${member.slug}`}
                  className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-dark"
                >
                  Full Profile
                </Link>
                {member.slug === "paul" && (
                  <Link
                    href="/strength-conditioning"
                    className="rounded-lg border border-brand-green px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green hover:text-white"
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
