import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscriptions";

export default async function EvaluationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const plan = await getUserPlan(user!.id);

  if (plan === "none" || plan === "bronze") {
    return (
      <div className="rounded-xl bg-brand-black p-8 text-brand-white">
        <h1 className="text-xl font-bold">My Evaluations</h1>
        <p className="mt-2 text-gray-300">
          Individual coach evaluations (written/verbal feedback + a 30-minute Zoom
          session) are included with Silver and Gold. Upgrade to unlock this feature.
        </p>
        <Link
          href="/packages"
          className="mt-4 inline-block rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold hover:bg-brand-green-dark"
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
          <h1 className="text-2xl font-bold text-brand-black">My Evaluations</h1>
          <p className="text-brand-gray">Coach feedback on your uploaded clips.</p>
        </div>
        {plan === "silver" && (
          <Link href="/packages" className="text-sm font-medium text-brand-green">
            Upgrade to Gold for 2x the feedback &rarr;
          </Link>
        )}
      </div>

      {!evaluations || evaluations.length === 0 ? (
        <p className="text-sm text-brand-gray">
          No evaluations yet. Upload clips from the{" "}
          <Link href="/dashboard/upload" className="text-brand-green font-medium">Upload Training Clips</Link>{" "}
          page to start your first cycle.
        </p>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evalItem) => (
            <div key={evalItem.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-brand-black">
                  {evalItem.cycle_start} &ndash; {evalItem.cycle_end}
                </p>
                <span className="rounded-full bg-brand-gray-light px-3 py-1 text-xs font-medium capitalize text-brand-black">
                  {evalItem.status.replace("_", " ")}
                </span>
              </div>
              {evalItem.feedback_text ? (
                <p className="mt-3 text-sm text-brand-black whitespace-pre-wrap">{evalItem.feedback_text}</p>
              ) : (
                <p className="mt-3 text-sm text-brand-gray">Feedback pending.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
