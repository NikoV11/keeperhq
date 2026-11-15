import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial-card";
import { getGoalkeepers } from "@/lib/content";

export const metadata = { title: "Goalkeepers We've Worked With | KeeperHQ" };

export default async function GoalkeepersPage() {
  const goalkeepers = await getGoalkeepers();

  return (
    <Section>
      <SectionHeading
        eyebrow="Track Record"
        title="Goalkeepers we have worked with"
        subtitle="From Olympic and World Cup squads to academy professionals, college starters, and high-school keepers."
      />
      {goalkeepers.length === 0 ? (
        <p className="text-sm text-brand-gray">Coming soon.</p>
      ) : (
        <>
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {goalkeepers.map((gk) => (
              <TestimonialCard key={gk.id} testimonial={gk} />
            ))}
          </div>
          <p className="mt-10 text-sm text-brand-gray">
            Coaches and parents have shared references too —{" "}
            <Link href="/testimonials" className="font-semibold text-brand-green">
              read all testimonials
            </Link>
            .
          </p>
        </>
      )}
    </Section>
  );
}
