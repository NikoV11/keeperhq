import { getPackages } from "@/lib/content";
import { CheckoutButton } from "@/components/checkout-button";
import { Reveal } from "@/components/reveal";

export async function PackageCards() {
  const packages = await getPackages();

  if (packages.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Membership packages are being set up — check back shortly.
      </p>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-3">
      {packages.map((tier, i) => {
        const featured = tier.featured;
        return (
          <Reveal key={tier.key} delay={i * 90}>
            <div
              className={`kh-lift relative flex h-full flex-col rounded-[1.25rem] p-8 ${
                featured
                  ? "bg-ink text-paper shadow-[var(--shadow-lg)] lg:-mt-4 lg:pb-12"
                  : "border border-line bg-paper"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-gold px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
                  Most popular
                </span>
              )}

              <p
                className={`text-sm font-bold uppercase tracking-[0.16em] ${
                  featured ? "text-gold" : "text-ink-muted"
                }`}
              >
                {tier.name}
              </p>

              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">
                  {tier.price_display}
                </span>
                <span
                  className={`text-sm ${featured ? "text-paper/55" : "text-ink-muted"}`}
                >
                  {tier.price_note}
                </span>
              </p>

              {tier.evaluation_note && (
                <p
                  className={`mt-4 rounded-full px-3.5 py-1.5 text-center text-xs font-semibold ${
                    featured ? "bg-white/10 text-gold" : "bg-gold-soft text-gold-dark"
                  }`}
                >
                  {tier.evaluation_note}
                </p>
              )}

              <ul className="mt-7 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <CheckIcon featured={featured} />
                    <span className={featured ? "text-paper/80" : "text-ink-muted"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <CheckoutButton
                productType="subscription"
                productKey={`${tier.key}_monthly`}
                variant={featured ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                Choose {tier.name}
              </CheckoutButton>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-gold" : "text-gold-deep"}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M8.1 14.2 4.4 10.5l1.3-1.3 2.4 2.4 6-6 1.3 1.3-7.3 7.3Z" />
    </svg>
  );
}
