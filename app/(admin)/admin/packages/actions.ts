"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function savePackageAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const key = String(formData.get("key") ?? "");
  if (!key) return;

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  await ctx.supabase
    .from("membership_packages")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      price_display: String(formData.get("price_display") ?? "").trim(),
      price_note: String(formData.get("price_note") ?? "").trim(),
      evaluation_note: String(formData.get("evaluation_note") ?? "").trim() || null,
      features,
      featured: formData.get("featured") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");
}
