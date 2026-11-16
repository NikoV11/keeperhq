import Link from "next/link";
import { Logo } from "@/components/logo";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coach");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["coach", "admin"].includes(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-paper-warm">
      <header className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="flex items-center gap-2">
            <Logo size="sm" href="/coach" />
            <span className="text-sm text-paper/55">Coach Console</span>
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-paper/55">{profile.full_name}</span>
            <Link href="/dashboard" className="text-gold hover:text-white">
              Member view
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
