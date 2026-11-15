"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

function revalidateTestimonialSurfaces() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/goalkeepers");
  revalidatePath("/");
}

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function saveTestimonialAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  // The compact "add" form posts only name/category/kind/profile, so creating a row
  // must not read absent checkboxes as an explicit false.
  if (!id) {
    await ctx.supabase.from("testimonials").insert({
      name,
      kind: String(formData.get("kind") ?? "written"),
      category: String(formData.get("category") ?? "goalkeeper"),
      profile: lines(formData.get("profile")),
    });
    revalidateTestimonialSurfaces();
    return;
  }

  await ctx.supabase
    .from("testimonials")
    .update({
      name,
      kind: String(formData.get("kind") ?? "written"),
      category: String(formData.get("category") ?? "goalkeeper"),
      profile: lines(formData.get("profile")),
      quote: String(formData.get("quote") ?? "").trim() || null,
      quote_original: String(formData.get("quote_original") ?? "").trim() || null,
      quote_original_language:
        String(formData.get("quote_original_language") ?? "").trim() || null,
      photo_path: String(formData.get("photo_path") ?? "").trim() || null,
      video_path: String(formData.get("video_path") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidateTestimonialSurfaces();
}

export async function deleteTestimonialAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await ctx.supabase.from("testimonials").delete().eq("id", id);
  revalidateTestimonialSurfaces();
}
