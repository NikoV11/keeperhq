import Link from "next/link";
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
    <div className="min-h-screen bg-brand-gray-light">
      <header className="bg-brand-black text-brand-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/coach" className="text-lg font-bold">
            KEEPER<span className="text-brand-green-light">HQ</span>
            <span className="ml-2 text-sm font-normal text-gray-400">Coach Console</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">{profile.full_name}</span>
            <Link href="/dashboard" className="text-brand-green-light hover:text-white">
              Member view
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
