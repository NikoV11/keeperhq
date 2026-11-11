import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";

export const metadata = { title: "Game Video Analysis | KeeperHQ" };

const STEPS = [
  "Purchase the analysis",
  "Schedule the Zoom session",
  "Upload the complete game or provide a full-game link",
  "Submit the footage at least 7 days before the scheduled Zoom",
  "A KeeperHQ coach reviews and prepares the analysis",
  "Meet individually on Zoom to discuss the game",
];

const ANALYSIS_AREAS = [
  "Positioning", "Starting position", "Decision-making", "Crosses",
  "Covering space", "Distribution", "Playing with the feet",
  "Communication", "Technique", "Key match situations",
];

export default function ServicesPage() {
  return (
    <>
      <Section dark>
        <SectionHeading
          dark
          eyebrow="One-Time Service"
          title="Game Video Analysis"
          subtitle="$39.99 — one-time purchase. A full breakdown of one of your games, reviewed 1-on-1 with a KeeperHQ coach on Zoom."
        />
        <Link href="/dashboard/game-analysis" className="inline-block rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold hover:bg-brand-green-dark">
          Purchase Game Analysis
        </Link>
        <p className="mt-3 text-sm text-gray-400">
          You&apos;ll need a KeeperHQ account to complete your purchase.
        </p>
      </Section>

      <Section>
        <SectionHeading title="How it works" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step} className="rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-bold text-brand-green">STEP {i + 1}</p>
              <p className="mt-1 text-sm text-brand-black">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-brand-gray-light">
        <SectionHeading
          title="What gets analyzed"
          subtitle="Your coach reviews the full game and builds the session around the moments that matter most for your development."
        />
        <div className="flex flex-wrap gap-2">
          {ANALYSIS_AREAS.map((area) => (
            <span key={area} className="rounded-full bg-white px-4 py-2 text-sm text-brand-black shadow-sm">
              {area}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
