import { Section, SectionHeading } from "@/components/section";
import { MediaImage } from "@/components/media-image";
import { getGoalkeepers } from "@/lib/content";

export const metadata = { title: "Goalkeepers We've Worked With | KeeperHQ" };

export default async function GoalkeepersPage() {
  const goalkeepers = await getGoalkeepers();

  return (
    <Section>
      <SectionHeading
        eyebrow="Track Record"
        title="Goalkeepers we have worked with"
        subtitle="Real goalkeepers at real levels — the coaching experience behind KeeperHQ."
      />
      {goalkeepers.length === 0 ? (
        <p className="text-sm text-brand-gray">Coming soon.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goalkeepers.map((gk) => (
            <div key={gk.id} className="rounded-xl border border-gray-200 p-5">
              <MediaImage
                path={gk.photo_path}
                alt={gk.name}
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
      )}
    </Section>
  );
}
