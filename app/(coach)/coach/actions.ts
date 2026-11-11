"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireCoach() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["coach", "admin"].includes(profile.role)) return null;
  return { supabase, user };
}

export async function openEvaluationAction(formData: FormData) {
  const memberId = String(formData.get("user_id") ?? "");
  if (!memberId) return;

  const ctx = await requireCoach();
  if (!ctx) return;
  const { supabase, user } = ctx;

  const now = new Date();
  const cycleStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data: evaluation, error } = await supabase
    .from("evaluations")
    .insert({
      user_id: memberId,
      coach_id: user.id,
      cycle_start: cycleStart.toISOString().slice(0, 10),
      cycle_end: cycleEnd.toISOString().slice(0, 10),
      status: "in_review",
    })
    .select("id")
    .single();

  if (error || !evaluation) return;

  await supabase
    .from("uploaded_clips")
    .update({ evaluation_id: evaluation.id })
    .eq("user_id", memberId)
    .is("evaluation_id", null);

  redirect(`/coach/evaluations/${evaluation.id}`);
}

export async function submitFeedbackAction(formData: FormData) {
  const evaluationId = String(formData.get("evaluation_id") ?? "");
  const feedback = String(formData.get("feedback_text") ?? "").trim();
  const complete = formData.get("complete") === "true";
  if (!evaluationId) return;

  const ctx = await requireCoach();
  if (!ctx) return;
  const { supabase, user } = ctx;

  await supabase
    .from("evaluations")
    .update({
      feedback_text: feedback || null,
      coach_id: user.id,
      status: complete ? "completed" : "in_review",
      completed_at: complete ? new Date().toISOString() : null,
    })
    .eq("id", evaluationId);

  revalidatePath(`/coach/evaluations/${evaluationId}`);
  revalidatePath("/coach");
}
