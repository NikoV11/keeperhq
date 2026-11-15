"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

function revalidateVideoSurfaces() {
  revalidatePath("/admin/videos");
  revalidatePath("/dashboard/training");
  revalidatePath("/training");
  revalidatePath("/");
}

export async function saveVideoAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;
  const { supabase } = ctx;

  const id = String(formData.get("id") ?? "");
  const row = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    category: String(formData.get("category") ?? ""),
    sub_type: String(formData.get("sub_type") ?? "") || null,
    storage_path: String(formData.get("storage_path") ?? "").trim(),
    thumbnail_path: String(formData.get("thumbnail_path") ?? "").trim() || null,
    is_free_trial: formData.get("is_free_trial") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    published: formData.get("published") === "on",
  };

  if (!row.title || !row.category || !row.storage_path) return;

  if (id) {
    await supabase.from("training_videos").update(row).eq("id", id);
  } else {
    await supabase.from("training_videos").insert(row);
  }

  revalidateVideoSurfaces();
  redirect("/admin/videos");
}

export async function togglePublishedAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (!id) return;

  await ctx.supabase.from("training_videos").update({ published }).eq("id", id);
  revalidateVideoSurfaces();
}

export async function deleteVideoAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { supabase } = ctx;
  const { data: video } = await supabase
    .from("training_videos")
    .select("storage_path, thumbnail_path")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("training_videos").delete().eq("id", id);

  // Remove the underlying files so deleted videos don't keep consuming storage.
  const paths = [video?.storage_path, video?.thumbnail_path].filter(
    (p): p is string => typeof p === "string" && p.length > 0
  );
  if (paths.length > 0) {
    await supabase.storage.from("media").remove(paths);
  }

  revalidateVideoSurfaces();
}
