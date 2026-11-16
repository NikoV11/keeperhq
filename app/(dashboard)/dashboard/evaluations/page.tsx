import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscriptions";

export default async function EvaluationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const plan = await getUserPlan(user!.id);

  if (plan === "none" || plan === "bronze") {
    return (
      <div className="rounded-xl bg-ink p-8 text-paper">
        <h1 className="text-xl font-bold">My Evaluations</h1>
        <p className="mt-2 text-paper/70">
          Individual coach evaluations (written/verbal feedback + a 30-minute Zoom
          session) are included with Silver and Gold. Upgrade to unlock this feature.
        </p>
        <Link
          href="/packages"
          className="mt-4 inline-block rounded-lg bg-gold px-4 py-2 text-sm font-semibold hover:bg-[#ffc23d]"
        >
          Upgrade Plan
        </Link>
      </div>
    );
  }

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("id, status, feedback_text, cycle_start, cycle_end, completed_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Evaluations</h1>
          <p className="text-ink-muted">Coach feedback on your uploaded clips.</p>
        </div>
        {plan === "silver" && (
          <Link href="/packages" className="text-sm font-medium text-gold-dark">
            Upgrade to Gold for 2x the feedback &rarr;
          </Link>
        )}
      </div>

      {!evaluations || evaluations.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No evaluations yet. Upload clips from the{" "}
          <Link href="/dashboard/upload" className="text-gold-dark font-medium">Upload Training Clips</Link>{" "}
          page to start your first cycle.
        </p>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evalItem) => (
            <div key={evalItem.id} className="rounded-[0.875rem] border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">
                  {evalItem.cycle_start} &ndash; {evalItem.cycle_end}
                </p>
                <span className="rounded-full bg-paper-warm px-3 py-1 text-xs font-medium capitalize text-ink">
                  {evalItem.status.replace("_", " ")}
                </span>
              </div>
              {evalItem.feedback_text ? (
                <p className="mt-3 text-sm text-ink whitespace-pre-wrap">{evalItem.feedback_text}</p>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">Feedback pending.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
