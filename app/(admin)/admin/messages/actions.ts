"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

export async function setMessageStatusAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (!ctx) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "read", "replied"].includes(status)) return;

  await ctx.supabase.from("contact_messages").update({ status }).eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
