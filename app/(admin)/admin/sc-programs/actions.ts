"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function saveSCProgramAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const key = String(formData.get("key") ?? "");
  if (!key) return;

  await ctx.supabase
    .from("sc_programs")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      focus: String(formData.get("focus") ?? "").trim() || null,
      price_display: String(formData.get("price_display") ?? "").trim() || null,
      published: formData.get("published") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  revalidatePath("/admin/sc-programs");
  revalidatePath("/strength-conditioning");
  revalidatePath("/dashboard/strength-conditioning");
  revalidatePath("/");
}
