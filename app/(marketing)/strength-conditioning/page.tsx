import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";
import { SC_PROGRAMS, SC_BUNDLE, SC_CUSTOM } from "@/content/sc-programs";

export const metadata = { title: "Strength & Conditioning | KeeperHQ" };

export default function StrengthConditioningPage() {
  return (
    <>
      <Section dark>
        <SectionHeading
          dark
          eyebrow="KeeperHQ x TAP"
          title="Strength & Conditioning for goalkeepers"
          subtitle="Goalkeeper-specific physical development with Paul Olla and Train.Adapt.Peak — built around the demands of the position, not generic gym work."
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
        <SectionHeading title="The four core programs" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SC_PROGRAMS.map((program) => (
            <div key={program.key} className="rounded-xl border border-gray-200 p-5">
              <p className="font-semibold text-brand-black">{program.title}</p>
              <p className="mt-1 text-sm text-brand-gray">{program.focus}</p>
              <p className="mt-3 text-sm font-medium text-brand-black">{program.priceRange}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-brand-gray-light p-6">
            <p className="font-semibold text-brand-black">{SC_BUNDLE.title}</p>
            <p className="mt-1 text-sm text-brand-gray">{SC_BUNDLE.focus}</p>
            <p className="mt-3 text-sm font-medium text-brand-black">{SC_BUNDLE.priceRange}</p>
          </div>
          <div className="rounded-xl bg-brand-gray-light p-6">
            <p className="font-semibold text-brand-black">{SC_CUSTOM.title}</p>
            <p className="mt-1 text-sm text-brand-gray">{SC_CUSTOM.focus}</p>
            <p className="mt-3 text-sm font-medium text-brand-black">
              {SC_CUSTOM.priceRangeOneTime} or {SC_CUSTOM.priceRangeMonthly}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-brand-gray">
          Pricing is being finalized with Train.Adapt.Peak. Purchase from your dashboard once
          you have a KeeperHQ account.
        </p>
        <Link href="/dashboard/strength-conditioning" className="mt-4 inline-block rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
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
