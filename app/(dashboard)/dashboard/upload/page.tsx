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
      <div className="rounded-xl bg-brand-black p-8 text-brand-white">
        <h1 className="text-xl font-bold">Upload Training Clips</h1>
        <p className="mt-2 text-gray-300">
          Uploading training clips for individual coach evaluation is a Silver and Gold
          feature. Upgrade your plan to start getting personal feedback on your game.
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

  const { data: pendingClips } = await supabase
    .from("uploaded_clips")
    .select("id, original_filename, notes, created_at")
    .eq("user_id", user!.id)
    .is("evaluation_id", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Upload Training Clips</h1>
        <p className="text-brand-gray">
          Submit up to 3 clips for your next evaluation. ({pendingClips?.length ?? 0}/3 used)
        </p>
      </div>

      <UploadForm disabled={(pendingClips?.length ?? 0) >= 3} userId={user!.id} />

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand-black mb-3">Pending clips</h2>
        {!pendingClips || pendingClips.length === 0 ? (
          <p className="text-sm text-brand-gray">No clips uploaded yet for this cycle.</p>
        ) : (
          <ul className="space-y-2">
            {pendingClips.map((clip) => (
              <li key={clip.id} className="text-sm text-brand-black">
                {clip.original_filename}
                {clip.notes && <span className="text-brand-gray"> — {clip.notes}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
