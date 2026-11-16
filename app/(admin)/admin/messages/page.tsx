import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { setMessageStatusAction } from "./actions";

const INTEREST_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  game_analysis: "Game Video Analysis",
  sc: "Strength & Conditioning",
  free_trial: "Free Trial",
  general: "General Question",
};

type Message = {
  id: string;
  name: string;
  email: string;
  gk_age: number | null;
  country: string | null;
  club_school: string | null;
  playing_level: string | null;
  interest: string | null;
  message: string;
  source: string;
  status: string;
  created_at: string;
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  const messages = (data as Message[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Enquiries from your contact page and the chat button."
      />

      {messages.length === 0 ? (
        <EmptyState>No messages yet.</EmptyState>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className={msg.status === "new" ? "ring-2 ring-gold" : ""}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {msg.name}{" "}
                    {msg.status === "new" && (
                      <span className="ml-1 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink">
                        New
                      </span>
                    )}
                  </p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-gold-dark hover:underline">
                    {msg.email}
                  </a>
                </div>
                <p className="text-xs text-ink-muted">
                  {new Date(msg.created_at).toLocaleString()} ·{" "}
                  {msg.source === "chat_widget" ? "Chat button" : "Contact page"}
                </p>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-ink-muted sm:grid-cols-4">
                <Detail label="Interested in" value={INTEREST_LABELS[msg.interest ?? "general"]} />
                <Detail label="GK age" value={msg.gk_age ? String(msg.gk_age) : null} />
                <Detail label="Country" value={msg.country} />
                <Detail label="Club / school" value={msg.club_school} />
                <Detail label="Playing level" value={msg.playing_level} />
              </dl>

              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-paper-warm p-3 text-sm text-ink">
                {msg.message}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: Your KeeperHQ enquiry`}
                  className="rounded-lg bg-gold px-4 py-2 text-xs font-bold text-ink hover:bg-[#ffc23d]"
                >
                  Reply by email
                </a>
                {["new", "read", "replied"]
                  .filter((s) => s !== msg.status)
                  .map((status) => (
                    <form key={status} action={setMessageStatusAction}>
                      <input type="hidden" name="id" value={msg.id} />
                      <input type="hidden" name="status" value={status} />
                      <button
                        type="submit"
                        className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink hover:border-gold"
                      >
                        Mark as {status}
                      </button>
                    </form>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-semibold uppercase tracking-wide text-[10px]">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
