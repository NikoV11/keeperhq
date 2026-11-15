"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function saveTeamMemberAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const sectionCount = Number(formData.get("section_count") ?? 0);
  const sections: { heading: string; body: string }[] = [];
  for (let i = 0; i < sectionCount; i++) {
    const heading = String(formData.get(`section_heading_${i}`) ?? "").trim();
    const body = String(formData.get(`section_body_${i}`) ?? "").trim();
    if (heading) sections.push({ heading, body });
  }

  const languages = String(formData.get("languages") ?? "")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  await ctx.supabase
    .from("team_members")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      role_title: String(formData.get("role_title") ?? "").trim(),
      short_bio: String(formData.get("short_bio") ?? "").trim() || null,
      photo_path: String(formData.get("photo_path") ?? "").trim() || null,
      cv_path: String(formData.get("cv_path") ?? "").trim() || null,
      cal_username: String(formData.get("cal_username") ?? "").trim() || null,
      languages,
      sections,
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/team");
  revalidatePath("/about");
  revalidatePath("/", "layout");
}
