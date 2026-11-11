"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavoriteAction(formData: FormData) {
  const videoId = String(formData.get("video_id") ?? "");
  if (!videoId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("video_id", videoId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
  } else {
    await supabase.from("favorites").insert({ user_id: user.id, video_id: videoId });
  }

  revalidatePath("/dashboard/training");
  revalidatePath("/dashboard/favorites");
}
