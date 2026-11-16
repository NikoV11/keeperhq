import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState, HelpNote } from "@/components/admin/ui";
import { setRoleAction } from "./actions";

type MemberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  role: string;
  created_at: string;
};

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, country, role, created_at")
    .order("created_at", { ascending: false });

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("user_id, plan, status")
    .eq("status", "active");

  const planByUser = new Map(
    (subscriptions ?? []).map((s) => [s.user_id as string, s.plan as string])
  );
  const members = (profiles as MemberRow[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Members"
        description="Everyone registered on your website, and what plan they're on."
      />

      <HelpNote>
        Give someone the <strong>Coach</strong> role so they can review clips and write
        evaluations. <strong>Admin</strong> also unlocks this website manager. Members can
        never see other members&apos; information.
      </HelpNote>

      {members.length === 0 ? (
        <EmptyState>Nobody has registered yet.</EmptyState>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line bg-paper-warm text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-5 py-3 font-medium text-ink">
                    {member.full_name ?? "—"}
                    {member.country && (
                      <span className="block text-xs text-ink-muted">{member.country}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <a href={`mailto:${member.email}`} className="text-gold-dark hover:underline">
                      {member.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 capitalize">
                    {planByUser.get(member.id) ?? (
                      <span className="text-ink-muted">No plan</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink-muted">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <form action={setRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={member.id} />
                      <select
                        name="role"
                        defaultValue={member.role}
                        className="rounded-lg border border-line px-2 py-1 text-xs"
                        aria-label={`Role for ${member.full_name ?? member.email}`}
                      >
                        <option value="member">Member</option>
                        <option value="coach">Coach</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-line px-2 py-1 text-xs font-semibold hover:border-gold"
                      >
                        Set
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
