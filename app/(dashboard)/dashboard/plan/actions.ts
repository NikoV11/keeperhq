"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPlanAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("training_plans").insert({ user_id: user.id, title, created_by: user.id });
  revalidatePath("/dashboard/plan");
}

export async function toggleItemDoneAction(formData: FormData) {
  const itemId = String(formData.get("item_id") ?? "");
  const done = formData.get("done") === "true";
  if (!itemId) return;

  const supabase = await createClient();
  await supabase.from("training_plan_items").update({ done }).eq("id", itemId);
  revalidatePath("/dashboard/plan");
}
