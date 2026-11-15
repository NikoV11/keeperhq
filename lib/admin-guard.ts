import { createClient } from "@/lib/supabase/server";

/**
 * Server actions are independently callable endpoints, so each admin action must
 * re-check the role itself — the layout's check does not protect them.
 * Returns null when the caller is not an admin.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return { supabase, user };
}
