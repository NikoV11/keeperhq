import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, HelpNote } from "@/components/admin/ui";

export default async function AdminOverview() {
  const supabase = await createClient();

  const counts = await Promise.all([
    supabase.from("training_videos").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("uploaded_clips").select("id", { count: "exact", head: true }).is("evaluation_id", null),
  ]);

  const [videos, newMessages, members, pendingClips] = counts.map((c) => c.count ?? 0);

  return (
    <div>
      <PageHeader
        title="Welcome to your website manager"
        description="Everything on your public website can be changed from here. Your changes go live immediately."
      />

      <HelpNote>
        <strong>New here?</strong> Start with <strong>Training Videos</strong> to build your
        library, then <strong>Team &amp; Coaches</strong> to add your photos and bios. Nothing
        you do here can break the website &mdash; you can always edit it again.
      </HelpNote>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Training videos" value={videos} href="/admin/videos" />
        <Stat label="New messages" value={newMessages} href="/admin/messages" highlight={newMessages > 0} />
        <Stat label="Registered members" value={members} href="/admin/members" />
        <Stat label="Clips awaiting review" value={pendingClips} href="/coach" highlight={pendingClips > 0} />
      </div>

      <Card>
        <h2 className="font-semibold text-brand-black">Common tasks</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <Task href="/admin/videos/new">Upload a new training video</Task>
          <Task href="/admin/team">Update a coach&apos;s photo, bio, or CV</Task>
          <Task href="/admin/testimonials">Add a testimonial from a goalkeeper, coach, or parent</Task>
          <Task href="/admin/packages">Change membership prices</Task>
          <Task href="/admin/settings">Edit your operating hours or homepage text</Task>
          <Task href="/coach">Review uploaded clips and write feedback</Task>
        </ul>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  highlight = false,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl bg-white p-5 shadow-sm hover:ring-2 hover:ring-brand-green ${
        highlight ? "ring-2 ring-brand-green" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-brand-gray">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-black">{value}</p>
    </Link>
  );
}

function Task({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="font-medium text-brand-green hover:text-brand-green-dark">
        {children} &rarr;
      </Link>
    </li>
  );
}
