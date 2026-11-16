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
      <Section tone="dark">
        <SectionHeading
          dark
          eyebrow="One-Time Service"
          title="Game Video Analysis"
          subtitle="$39.99 — one-time purchase. A full breakdown of one of your games, reviewed 1-on-1 with a KeeperHQ coach on Zoom."
        />
        <Link href="/dashboard/game-analysis" className="inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-[#ffc23d]">
          Purchase Game Analysis
        </Link>
        <p className="mt-3 text-sm text-paper/55">
          You&apos;ll need a KeeperHQ account to complete your purchase.
        </p>
      </Section>

      <Section>
        <SectionHeading title="How it works" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step} className="kh-lift rounded-[0.875rem] border border-line bg-paper p-5">
              <p className="text-xs font-bold text-gold-dark">STEP {i + 1}</p>
              <p className="mt-1 text-sm text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="warm">
        <SectionHeading
          title="What gets analyzed"
          subtitle="Your coach reviews the full game and builds the session around the moments that matter most for your development."
        />
        <div className="flex flex-wrap gap-2">
          {ANALYSIS_AREAS.map((area) => (
            <span key={area} className="rounded-full bg-paper px-4 py-2 text-sm text-ink shadow-sm">
              {area}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
