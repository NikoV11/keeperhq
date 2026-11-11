import { Section, SectionHeading } from "@/components/section";
import { QuestionnaireForm } from "./questionnaire-form";

export const metadata = { title: "Find My S&C Program | KeeperHQ" };

export default function QuestionnairePage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="KeeperHQ x TAP"
        title="Find your S&C program"
        subtitle="Answer a few questions and we'll recommend the KeeperHQ x TAP program that fits your level, equipment, and schedule."
      />
      <QuestionnaireForm />
    </Section>
  );
}
