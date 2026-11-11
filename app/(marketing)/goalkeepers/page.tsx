import Image from "next/image";
import { Section, SectionHeading } from "@/components/section";
import { GOALKEEPERS } from "@/content/testimonials";

export const metadata = { title: "Goalkeepers We've Worked With | KeeperHQ" };

export default function GoalkeepersPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Track Record"
        title="Goalkeepers we have worked with"
        subtitle="Real goalkeepers at real levels — the coaching experience behind KeeperHQ."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GOALKEEPERS.map((gk) => (
          <div key={gk.id} className="rounded-xl border border-gray-200 p-5">
            <Image
              src={gk.photoPath}
              alt={gk.name}
              width={400}
              height={400}
              className="mb-3 aspect-square w-full rounded-lg object-cover"
            />
            <p className="font-semibold text-brand-black">{gk.name}</p>
            <p className="text-sm text-brand-gray">{gk.affiliation}</p>
            <p className="text-sm text-brand-gray">{gk.level}</p>
            {gk.coach && <p className="mt-1 text-xs text-brand-green">Coach: {gk.coach}</p>}
            {gk.quote && <p className="mt-2 text-sm text-brand-gray">&ldquo;{gk.quote}&rdquo;</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
