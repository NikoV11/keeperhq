"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ full_name: fullName || null, country: country || null })
    .eq("id", user.id);

  revalidatePath("/dashboard/account");
}
