import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/section";
import { TRAINING_CATEGORIES } from "@/content/site";

export const metadata = { title: "Training Library | KeeperHQ" };

export default async function TrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: freeVideos } = await supabase
    .from("training_videos")
    .select("id, title, description, category")
    .eq("is_free_trial", true)
    .eq("published", true)
    .order("sort_order");

  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Training Library"
          title="Structured goalkeeper training, category by category"
          subtitle="Individual and partner exercises, indoor and outdoor variations — so you always know exactly what to work on next, wherever you are."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINING_CATEGORIES.map((cat) => (
            <div key={cat.key} className="rounded-xl border border-gray-200 p-5">
              <p className="font-semibold text-brand-black">{cat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-gray-light">
        <SectionHeading
          title="Try it free"
          subtitle="Create a free account to unlock selected training videos — no card required."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {(freeVideos && freeVideos.length > 0
            ? freeVideos
            : [
                { id: "p1", title: "Handling", description: "Sample video coming soon.", category: "handling" },
                { id: "p2", title: "Movement / Set Position", description: "Sample video coming soon.", category: "set_position" },
                { id: "p3", title: "Low Diving", description: "Sample video coming soon.", category: "diving" },
              ]
          ).map((video) => (
            <div key={video.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 aspect-video rounded-lg bg-brand-gray-light" />
              <p className="font-semibold text-brand-black">{video.title}</p>
              <p className="mt-1 text-sm text-brand-gray">{video.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link href="/dashboard/training" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
              Go to My Training Library
            </Link>
          ) : (
            <>
              <Link href="/register" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
                START YOUR FREE TRIAL
              </Link>
              <Link href="/packages" className="rounded-lg border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white">
                Unlock the Full Library
              </Link>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
