import Link from "next/link";
import { Logo } from "@/components/logo";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscriptions";
import { logoutAction } from "../(auth)/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "My Dashboard" },
  { href: "/dashboard/training", label: "Training Library" },
  { href: "/dashboard/favorites", label: "My Favorites" },
  { href: "/dashboard/plan", label: "My Training Plan" },
  { href: "/dashboard/upload", label: "Upload Training Clips" },
  { href: "/dashboard/evaluations", label: "My Evaluations" },
  { href: "/dashboard/schedule", label: "Schedule My Zoom" },
  { href: "/dashboard/game-analysis", label: "Game Analysis" },
  { href: "/dashboard/strength-conditioning", label: "Strength & Conditioning" },
  { href: "/dashboard/account", label: "My Account" },
  { href: "/dashboard/support", label: "Support" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const plan = await getUserPlan(user.id);

  return (
    <div className="min-h-screen bg-paper-warm flex">
      <aside className="w-64 shrink-0 bg-ink text-paper flex flex-col">
        <div className="px-6 py-6">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-paper/70 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {profile?.role === "coach" || profile?.role === "admin" ? (
            <Link
              href="/coach"
              className="block rounded-lg px-3 py-2 text-sm text-gold hover:bg-white/10"
            >
              Coach Console
            </Link>
          ) : null}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-sm font-medium">{profile?.full_name ?? "Member"}</p>
          <p className="text-xs uppercase tracking-wide text-gold">{plan} plan</p>
          <form action={logoutAction} className="mt-3">
            <button type="submit" className="text-xs text-paper/55 hover:text-white">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
