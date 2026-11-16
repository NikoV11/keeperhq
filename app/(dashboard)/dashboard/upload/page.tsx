import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscriptions";
import { UploadForm } from "./upload-form";

export default async function UploadClipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const plan = await getUserPlan(user!.id);

  if (plan === "none" || plan === "bronze") {
    return (
      <div className="rounded-xl bg-ink p-8 text-paper">
        <h1 className="text-xl font-bold">Upload Training Clips</h1>
        <p className="mt-2 text-paper/70">
          Uploading training clips for individual coach evaluation is a Silver and Gold
          feature. Upgrade your plan to start getting personal feedback on your game.
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

  const { data: pendingClips } = await supabase
    .from("uploaded_clips")
    .select("id, original_filename, notes, created_at")
    .eq("user_id", user!.id)
    .is("evaluation_id", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Upload Training Clips</h1>
        <p className="text-ink-muted">
          Submit up to 3 clips for your next evaluation. ({pendingClips?.length ?? 0}/3 used)
        </p>
      </div>

      <UploadForm disabled={(pendingClips?.length ?? 0) >= 3} userId={user!.id} />

      <div className="rounded-[0.875rem] border border-line bg-paper p-5">
        <h2 className="font-semibold text-ink mb-3">Pending clips</h2>
        {!pendingClips || pendingClips.length === 0 ? (
          <p className="text-sm text-ink-muted">No clips uploaded yet for this cycle.</p>
        ) : (
          <ul className="space-y-2">
            {pendingClips.map((clip) => (
              <li key={clip.id} className="text-sm text-ink">
                {clip.original_filename}
                {clip.notes && <span className="text-ink-muted"> — {clip.notes}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
