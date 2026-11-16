import { Section, SectionHeading } from "@/components/section";
import { CalEmbed } from "@/components/cal-embed";

export const metadata = { title: "Schedule a Free Call | KeeperHQ" };

export default function ScheduleCallPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="No Purchase Required"
        title="Want to meet us first?"
        subtitle="Schedule a free KeeperHQ Zoom call. Meet a coach, learn how KeeperHQ works, understand the memberships and services, ask questions, and discuss your goalkeeper-development goals."
      />
      <div className="rounded-2xl border border-line p-2">
        <CalEmbed coach="stefan" />
      </div>
    </Section>
  );
}
