"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function saveLegalDocumentAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!slug || !title) return;

  await ctx.supabase
    .from("legal_documents")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  revalidatePath("/admin/legal");
  revalidatePath(`/legal/${slug}`);
}
