import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";
import { getSCPrograms } from "@/lib/content";

export const metadata = { title: "Strength & Conditioning | KeeperHQ" };

export default async function StrengthConditioningPage() {
  const programs = await getSCPrograms();
  const core = programs.filter((p) => p.category === "program");
  const extras = programs.filter((p) => p.category !== "program");

  return (
    <>
      <Section dark>
        <SectionHeading
          dark
          eyebrow="KeeperHQ x TAP"
          title="Strength & Conditioning for goalkeepers"
          subtitle="Goalkeeper-specific physical development with Train.Adapt.Peak — built around the demands of the position, not generic gym work."
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/strength-conditioning/questionnaire" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold hover:bg-brand-green-dark">
            Find My Program
          </Link>
          <Link href="/about/paul" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
            Meet Paul
          </Link>
        </div>
      </Section>

      <Section>
        <SectionHeading title="The core programs" />
        {core.length === 0 ? (
          <p className="text-sm text-brand-gray">Programs coming soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {core.map((program) => (
              <div key={program.key} className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-brand-black">{program.title}</p>
                <p className="mt-1 text-sm text-brand-gray">{program.focus}</p>
                <p className="mt-3 text-sm font-medium text-brand-black">{program.price_display}</p>
              </div>
            ))}
          </div>
        )}

        {extras.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {extras.map((program) => (
              <div key={program.key} className="rounded-xl bg-brand-gray-light p-6">
                <p className="font-semibold text-brand-black">{program.title}</p>
                <p className="mt-1 text-sm text-brand-gray">{program.focus}</p>
                <p className="mt-3 text-sm font-medium text-brand-black">{program.price_display}</p>
              </div>
            ))}
          </div>
        )}

        <Link href="/dashboard/strength-conditioning" className="mt-8 inline-block rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
          Purchase in My Dashboard
        </Link>
      </Section>

      <Section className="bg-brand-gray-light">
        <SectionHeading
          eyebrow="Coming Soon"
          title="KeeperHQ x TAP Goalkeeper Nutrition"
          subtitle="A future expansion once the initial S&C lineup is established."
        />
      </Section>
    </>
  );
}
