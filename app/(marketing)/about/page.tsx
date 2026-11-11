import Link from "next/link";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/section";
import { TEAM } from "@/content/team";

export const metadata = { title: "About Us | KeeperHQ" };

export default function AboutPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="About Us"
        title="Meet the KeeperHQ team"
        subtitle="Goalkeeper coaches and a dedicated strength and conditioning specialist, focused entirely on goalkeeper development."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        {TEAM.map((member) => (
          <div key={member.slug} className="rounded-xl border border-gray-200 p-5">
            <Image
              src={member.photoPath}
              alt={member.name}
              width={400}
              height={400}
              className="mb-4 aspect-square w-full rounded-lg object-cover"
            />
            <p className="font-semibold text-brand-black">{member.name}</p>
            <p className="text-sm text-brand-green">{member.role}</p>
            <p className="mt-2 text-sm text-brand-gray">{member.shortBio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/about/${member.slug}`} className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-dark">
                Full Profile
              </Link>
              {member.slug === "paul" && (
                <Link href="/strength-conditioning" className="rounded-lg border border-brand-green px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green hover:text-white">
                  View S&C Programs
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
