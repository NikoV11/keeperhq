"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

// Codes apply to the S&C products the checkout flow validates against.
const DEFAULT_APPLIES_TO = ["sc_program", "sc_bundle", "sc_custom"];

export async function saveReferralCodeAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return;

  const expiresRaw = String(formData.get("expires_at") ?? "").trim();
  const isNew = !formData.has("active") && !formData.has("expires_at");

  await ctx.supabase.from("referral_codes").upsert(
    {
      code,
      discount_type: String(formData.get("discount_type") ?? "percent"),
      discount_value: Number(formData.get("discount_value") ?? 0),
      // The compact add form has no checkbox, so new codes default to active.
      active: isNew ? true : formData.get("active") === "on",
      applies_to: DEFAULT_APPLIES_TO,
      expires_at: expiresRaw ? new Date(expiresRaw).toISOString() : null,
    },
    { onConflict: "code" }
  );

  revalidatePath("/admin/referral-codes");
}

export async function deleteReferralCodeAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const code = String(formData.get("code") ?? "");
  if (!code) return;

  await ctx.supabase.from("referral_codes").delete().eq("code", code);
  revalidatePath("/admin/referral-codes");
}
