import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscriptions";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const plan = await getUserPlan(user!.id);

  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: clipsCount } = await supabase
    .from("uploaded_clips")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: latestEvaluation } = await supabase
    .from("evaluations")
    .select("status, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Dashboard</h1>
        <p className="text-ink-muted">Here&apos;s where your development stands.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Current plan" value={plan === "none" ? "No active plan" : plan} />
        <Stat label="Favorited videos" value={String(favoritesCount ?? 0)} />
        <Stat label="Clips uploaded" value={String(clipsCount ?? 0)} />
      </div>

      {plan === "none" && (
        <div className="rounded-xl bg-ink p-6 text-paper">
          <p className="font-semibold">You don&apos;t have an active membership yet.</p>
          <p className="mt-1 text-sm text-paper/70">
            Choose Bronze, Silver, or Gold to unlock the full training library and coach feedback.
          </p>
          <Link
            href="/packages"
            className="mt-4 inline-block rounded-lg bg-gold px-4 py-2 text-sm font-semibold hover:bg-[#ffc23d]"
          >
            View Packages
          </Link>
        </div>
      )}

      <div className="rounded-[0.875rem] border border-line bg-paper p-6">
        <h2 className="font-semibold text-ink mb-2">Latest Evaluation</h2>
        {latestEvaluation ? (
          <p className="text-sm text-ink-muted">
            Status: <span className="font-medium capitalize">{latestEvaluation.status}</span>
          </p>
        ) : (
          <p className="text-sm text-ink-muted">No evaluations yet.</p>
        )}
        <Link href="/dashboard/evaluations" className="mt-3 inline-block text-sm font-medium text-gold-dark">
          View My Evaluations &rarr;
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.875rem] border border-line bg-paper p-5">
      <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink capitalize">{value}</p>
    </div>
  );
}
