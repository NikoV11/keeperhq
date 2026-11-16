import { getCalUsernames } from "@/lib/content";

/**
 * Embeds a coach's Cal.com booking page. Usernames are managed in the admin panel
 * (Site Text & Hours), so scheduling can be turned on without a code change.
 */
export async function CalEmbed({
  coach = "stefan",
  eventSlug,
}: {
  coach?: "stefan" | "paul";
  eventSlug?: string;
}) {
  const usernames = await getCalUsernames();
  const username = usernames[coach]?.trim();

  if (!username) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-lg bg-paper-warm p-6 text-center text-sm text-ink-muted">
        <p className="font-medium text-ink">Online booking isn&apos;t set up yet.</p>
        <p>
          In the meantime, please{" "}
          <a href="/contact" className="font-medium text-gold-dark hover:underline">
            send us a message
          </a>{" "}
          and we&apos;ll arrange a call.
        </p>
      </div>
    );
  }

  const path = eventSlug ? `${username}/${eventSlug}` : username;

  return (
    <iframe
      src={`https://cal.com/${path}?embed=true`}
      title="Schedule a call"
      className="h-[720px] w-full rounded-lg border-0"
      loading="lazy"
    />
  );
}
