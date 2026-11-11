import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { openEvaluationAction } from "./actions";

type ProfileRef = { full_name: string | null; email: string | null } | null;

export default async function CoachQueuePage() {
  const supabase = await createClient();

  const { data: pendingClips } = await supabase
    .from("uploaded_clips")
    .select("id, user_id, original_filename, notes, created_at, profiles(full_name, email)")
    .is("evaluation_id", null)
    .order("created_at", { ascending: true });

  const { data: openEvaluations } = await supabase
    .from("evaluations")
    .select("id, user_id, status, cycle_start, cycle_end, profiles(full_name, email)")
    .in("status", ["pending", "in_review"])
    .order("created_at", { ascending: true });

  // Group unlinked clips by member so a coach opens one evaluation per member.
  const byMember = new Map<string, { name: string; clips: NonNullable<typeof pendingClips> }>();
  for (const clip of pendingClips ?? []) {
    const profile = clip.profiles as unknown as ProfileRef;
    const name = profile?.full_name ?? profile?.email ?? "Member";
    const entry = byMember.get(clip.user_id) ?? { name, clips: [] };
    entry.clips.push(clip);
    byMember.set(clip.user_id, entry);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Evaluation Queue</h1>
        <p className="text-brand-gray">Members with clips waiting to be reviewed.</p>
      </div>

      <section>
        <h2 className="mb-3 font-semibold text-brand-black">
          Awaiting an evaluation ({byMember.size})
        </h2>
        {byMember.size === 0 ? (
          <p className="text-sm text-brand-gray">No unassigned clips right now.</p>
        ) : (
          <div className="space-y-3">
            {Array.from(byMember.entries()).map(([userId, entry]) => (
              <div key={userId} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-brand-black">{entry.name}</p>
                    <p className="text-sm text-brand-gray">
                      {entry.clips.length} clip{entry.clips.length === 1 ? "" : "s"} uploaded
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-brand-gray">
                      {entry.clips.map((clip) => (
                        <li key={clip.id}>
                          {clip.original_filename}
                          {clip.notes && <span> — {clip.notes}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form action={openEvaluationAction}>
                    <input type="hidden" name="user_id" value={userId} />
                    <button type="submit" className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark">
                      Open Evaluation
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-brand-black">
          In progress ({openEvaluations?.length ?? 0})
        </h2>
        {!openEvaluations || openEvaluations.length === 0 ? (
          <p className="text-sm text-brand-gray">Nothing in progress.</p>
        ) : (
          <div className="space-y-3">
            {openEvaluations.map((item) => {
              const profile = item.profiles as unknown as ProfileRef;
              return (
                <Link
                  key={item.id}
                  href={`/coach/evaluations/${item.id}`}
                  className="block rounded-xl bg-white p-5 shadow-sm hover:ring-2 hover:ring-brand-green"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-brand-black">
                        {profile?.full_name ?? profile?.email ?? "Member"}
                      </p>
                      <p className="text-sm text-brand-gray">
                        {item.cycle_start} &ndash; {item.cycle_end}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-gray-light px-3 py-1 text-xs font-medium capitalize">
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
