"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function setRoleAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;
  const { supabase, user } = ctx;

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!id || !["member", "coach", "admin"].includes(role)) return;

  // Don't let an admin demote themselves — that would lock them out of this page
  // with no way back in except direct database access.
  if (id === user.id && role !== "admin") return;

  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/members");
}
