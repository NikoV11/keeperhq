import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { MediaImage } from "@/components/media-image";
import { getTeamMemberBySlug } from "@/lib/content";
import { publicMediaUrl } from "@/lib/media";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  return { title: member ? `${member.name} | KeeperHQ` : "Profile | KeeperHQ" };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) notFound();

  const cvUrl = publicMediaUrl(member.cv_path);

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <MediaImage
            path={member.photo_path}
            alt={member.name}
            className="aspect-square w-full rounded-2xl object-cover"
          />
          <div className="mt-4 space-y-2">
            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-brand-green px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-green-dark"
              >
                View / Download CV
              </a>
            ) : (
              <p className="rounded-lg bg-brand-gray-light px-4 py-2 text-center text-sm text-brand-gray">
                CV coming soon
              </p>
            )}
            <Link href="/#intro" className="block text-center text-sm font-medium text-brand-green">
              Watch the KeeperHQ intro video
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-brand-black">{member.name}</h1>
          <p className="mt-1 font-medium text-brand-green">{member.role_title}</p>
          {member.short_bio && <p className="mt-4 text-brand-gray">{member.short_bio}</p>}

          {member.languages.length > 0 && (
            <p className="mt-4 text-sm text-brand-gray">
              <span className="font-semibold text-brand-black">Languages:</span>{" "}
              {member.languages.join(", ")}
            </p>
          )}

          <div className="mt-8 space-y-6">
            {member.sections
              .filter((section) => section.body)
              .map((section) => (
                <div key={section.heading}>
                  <h2 className="font-semibold text-brand-black">{section.heading}</h2>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-brand-gray">{section.body}</p>
                </div>
              ))}
          </div>

          <Link href="/about" className="mt-10 inline-block text-sm font-semibold text-brand-green">
            &larr; Back to the team
          </Link>
        </div>
      </div>
    </Section>
  );
}
