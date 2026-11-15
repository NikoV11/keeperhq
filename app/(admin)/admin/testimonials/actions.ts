"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

function revalidateTestimonialSurfaces() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function saveTestimonialAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const ageRaw = String(formData.get("age") ?? "").trim();

  // The compact "add" form only posts name/affiliation, so on create we take
  // defaults for everything else rather than reading absent checkboxes as false.
  const base = {
    kind: String(formData.get("kind") ?? "written"),
    name,
    affiliation: String(formData.get("affiliation") ?? "").trim() || null,
    quote: String(formData.get("quote") ?? "").trim() || null,
    age: ageRaw ? Number(ageRaw) : null,
  };

  if (id) {
    await ctx.supabase
      .from("testimonials")
      .update({
        ...base,
        video_path: String(formData.get("video_path") ?? "").trim() || null,
        thumbnail_path: String(formData.get("thumbnail_path") ?? "").trim() || null,
        featured: formData.get("featured") === "on",
        published: formData.get("published") === "on",
        sort_order: Number(formData.get("sort_order") ?? 0) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } else {
    await ctx.supabase.from("testimonials").insert(base);
  }

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
