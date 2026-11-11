import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client: server-only, bypasses RLS. Never import this from client components
// or any code path that could end up in the browser bundle.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
