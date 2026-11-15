"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

function revalidateGoalkeeperSurfaces() {
  revalidatePath("/admin/goalkeepers");
  revalidatePath("/goalkeepers");
  revalidatePath("/");
}

export async function saveGoalkeeperAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const base = {
    name,
    affiliation: String(formData.get("affiliation") ?? "").trim() || null,
  };

  if (id) {
    await ctx.supabase
      .from("goalkeepers")
      .update({
        ...base,
        level: String(formData.get("level") ?? "").trim() || null,
        coach: String(formData.get("coach") ?? "").trim() || null,
        quote: String(formData.get("quote") ?? "").trim() || null,
        photo_path: String(formData.get("photo_path") ?? "").trim() || null,
        published: formData.get("published") === "on",
        sort_order: Number(formData.get("sort_order") ?? 0) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } else {
    await ctx.supabase.from("goalkeepers").insert(base);
  }

  revalidateGoalkeeperSurfaces();
}

export async function deleteGoalkeeperAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await ctx.supabase.from("goalkeepers").delete().eq("id", id);
  revalidateGoalkeeperSurfaces();
}
