// Until a Supabase project exists, the public site should still render rather than
// crashing on every request. When the real values are absent we hand the SDK a
// syntactically valid but unroutable URL: client construction succeeds, nobody is
// logged in, and data reads return an error that callers already fall back from.
const REAL_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const REAL_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(REAL_URL && REAL_ANON_KEY);

export const SUPABASE_URL = REAL_URL || "http://127.0.0.1:54321";
export const SUPABASE_ANON_KEY = REAL_ANON_KEY || "unconfigured-anon-key";

if (!isSupabaseConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    "\n[KeeperHQ] Supabase is not configured — running in preview mode.\n" +
      "Public pages render, but registration, login, uploads, and payments will not work.\n" +
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local " +
      "(see README.md).\n"
  );
}
