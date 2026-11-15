import { createClient } from "@/lib/supabase/server";
import { PageHeader, HelpNote } from "@/components/admin/ui";
import type { TeamMember } from "@/lib/content";
import { TeamMemberForm } from "./team-form";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <PageHeader
        title="Team & Coaches"
        description="Each coach's photo, bio, CV, and booking link. These appear on your About page."
      />

      <HelpNote>
        The sections below (About, Playing Career, and so on) are exactly what visitors see on
        each coach&apos;s profile page. Leave a section empty to hide it.
      </HelpNote>

      <div className="space-y-8">
        {((members as TeamMember[]) ?? []).map((member) => (
          <TeamMemberForm key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
