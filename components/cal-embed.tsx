export function CalEmbed({ calUsername, eventSlug }: { calUsername?: string; eventSlug?: string }) {
  if (!calUsername) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg bg-brand-gray-light text-sm text-brand-gray">
        Scheduling isn&apos;t configured yet — set the Cal.com username in your environment
        variables to enable booking here.
      </div>
    );
  }

  const path = eventSlug ? `${calUsername}/${eventSlug}` : calUsername;

  return (
    <iframe
      src={`https://cal.com/${path}?embed=true`}
      title="Schedule a call"
      className="h-[720px] w-full rounded-lg border-0"
      loading="lazy"
    />
  );
}
