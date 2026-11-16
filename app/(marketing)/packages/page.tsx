import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";
import { PackageCards } from "@/components/package-cards";

export const metadata = { title: "Packages | KeeperHQ" };

export default function PackagesPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Membership"
          title="KeeperHQ membership packages"
          subtitle="Every package includes full access to the KeeperHQ training library. Silver and Gold add individual coach evaluations with written and verbal feedback plus 30-minute Zoom sessions."
        />
        <PackageCards />
        <p className="mt-8 text-sm text-ink-muted">
          Gold includes 2 individual evaluations per month — roughly every two weeks.
        </p>
      </Section>

      <Section tone="warm">
        <SectionHeading title="Not sure which package fits?" />
        <p className="max-w-2xl text-ink-muted">
          Book a free Zoom call with a KeeperHQ coach. We&apos;ll talk through your goals and
          recommend the right starting point — no purchase required.
        </p>
        <Link href="/schedule-a-call" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-[#ffc23d]">
          Schedule a Free Call
        </Link>
      </Section>
    </>
  );
}
