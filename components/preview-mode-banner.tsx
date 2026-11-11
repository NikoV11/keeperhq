import { isSupabaseConfigured } from "@/lib/supabase/config";

export function PreviewModeBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="bg-amber-400 px-4 py-2 text-center text-sm text-amber-950">
      <strong>Preview mode</strong> — Supabase isn&apos;t connected, so registration, login,
      uploads, and payments are inactive. See README.md to finish setup.
    </div>
  );
}
