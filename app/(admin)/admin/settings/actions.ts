"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function saveSettingsAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;
  const { supabase } = ctx;

  const socialLinks = String(formData.get("social_links") ?? "")
    .split("\n")
    .map((line) => {
      const [label, href] = line.split("|").map((p) => p.trim());
      return label && href ? { label, href } : null;
    })
    .filter((l): l is { label: string; href: string } => l !== null);

  const updates: { key: string; value: unknown }[] = [
    {
      key: "site_text",
      value: {
        tagline: String(formData.get("tagline") ?? "").trim(),
        hero_description: String(formData.get("hero_description") ?? "").trim(),
        cta: String(formData.get("cta") ?? "").trim(),
        contact_email: String(formData.get("contact_email") ?? "").trim(),
      },
    },
    {
      key: "operating_hours",
      value: {
        summary: String(formData.get("hours_summary") ?? "").trim(),
        timezone: String(formData.get("hours_timezone") ?? "").trim(),
        note: String(formData.get("hours_note") ?? "").trim(),
      },
    },
    {
      key: "cal_usernames",
      value: {
        stefan: String(formData.get("cal_stefan") ?? "").trim(),
        paul: String(formData.get("cal_paul") ?? "").trim(),
      },
    },
    { key: "social_links", value: socialLinks },
    {
      key: "intro_video_path",
      value: String(formData.get("intro_video_path") ?? "").trim() || null,
    },
  ];

  await supabase.from("app_config").upsert(
    updates.map((u) => ({ ...u, updated_at: new Date().toISOString() })),
    { onConflict: "key" }
  );

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
