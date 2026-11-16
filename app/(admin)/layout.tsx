import Link from "next/link";
import { Logo } from "@/components/logo";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "../(auth)/actions";

const SECTIONS = [
  {
    heading: "Your website",
    items: [
      { href: "/admin", label: "Overview" },
      { href: "/admin/videos", label: "Training Videos" },
      { href: "/admin/team", label: "Team & Coaches" },
      { href: "/admin/testimonials", label: "Testimonials & Goalkeepers" },
    ],
  },
  {
    heading: "Pricing & text",
    items: [
      { href: "/admin/packages", label: "Membership Prices" },
      { href: "/admin/sc-programs", label: "S&C Programs" },
      { href: "/admin/settings", label: "Site Text & Hours" },
      { href: "/admin/legal", label: "Legal Pages" },
      { href: "/admin/referral-codes", label: "Discount Codes" },
    ],
  },
  {
    heading: "People",
    items: [
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/members", label: "Members" },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-brand-gray-light">
      <aside className="flex w-64 shrink-0 flex-col bg-brand-black text-brand-white">
        <div className="px-6 py-6">
          <Logo size="sm" href="/admin" />
          <span className="mt-1 block text-xs text-gray-400">Website Manager</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {SECTIONS.map((section) => (
            <div key={section.heading} className="mb-5">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {section.heading}
              </p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-6 py-4 text-sm">
          <p className="font-medium">{profile.full_name ?? "Admin"}</p>
          <div className="mt-2 flex flex-col gap-1 text-xs">
            <Link href="/" className="text-brand-green-light hover:text-white">
              View live website
            </Link>
            <Link href="/coach" className="text-gray-400 hover:text-white">
              Coach console
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-gray-400 hover:text-white">Log out</button>
            </form>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
