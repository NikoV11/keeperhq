import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { submitFeedbackAction } from "../../actions";
import { ClipPlayer } from "./clip-player";

export default async function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id, user_id, status, cycle_start, cycle_end, feedback_text, profiles(full_name, email)")
    .eq("id", id)
    .maybeSingle();

  if (!evaluation) notFound();

  const { data: clips } = await supabase
    .from("uploaded_clips")
    .select("id, storage_path, original_filename, notes")
    .eq("evaluation_id", id)
    .order("created_at");

  const profile = evaluation.profiles as unknown as { full_name: string | null; email: string | null } | null;

  return (
    <div className="space-y-6">
      <Link href="/coach" className="text-sm font-medium text-gold-dark">
        &larr; Back to queue
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">
          {profile?.full_name ?? profile?.email ?? "Member"}
        </h1>
        <p className="text-ink-muted">
          Cycle {evaluation.cycle_start} &ndash; {evaluation.cycle_end} ·{" "}
          <span className="capitalize">{evaluation.status.replace("_", " ")}</span>
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold text-ink">Uploaded clips ({clips?.length ?? 0})</h2>
        {!clips || clips.length === 0 ? (
          <p className="text-sm text-ink-muted">No clips linked to this evaluation.</p>
        ) : (
          clips.map((clip) => (
            <div key={clip.id} className="rounded-[0.875rem] border border-line bg-paper p-5">
              <p className="font-medium text-ink">{clip.original_filename}</p>
              {clip.notes && <p className="mt-1 text-sm text-ink-muted">Member note: {clip.notes}</p>}
              <ClipPlayer storagePath={clip.storage_path} />
            </div>
          ))
        )}
      </section>

      <form action={submitFeedbackAction} className="rounded-[0.875rem] border border-line bg-paper p-6 space-y-4">
        <input type="hidden" name="evaluation_id" value={evaluation.id} />
        <div>
          <label className="mb-1 block font-semibold text-ink">Written feedback</label>
          <textarea
            name="feedback_text"
            rows={10}
            defaultValue={evaluation.feedback_text ?? ""}
            placeholder="Technique, positioning, decision-making, what to work on next..."
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            name="complete"
            value="false"
            className="rounded-lg border border-gold px-5 py-2.5 text-sm font-semibold text-gold-dark hover:bg-gold hover:text-ink"
          >
            Save Draft
          </button>
          <button
            type="submit"
            name="complete"
            value="true"
            className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-ink hover:bg-[#ffc23d]"
          >
            Submit &amp; Mark Complete
          </button>
        </div>
      </form>
    </div>
  );
}
