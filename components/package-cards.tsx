import { PACKAGES } from "@/content/packages";
import { CheckoutButton } from "@/components/checkout-button";

export function PackageCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PACKAGES.map((tier) => (
        <div
          key={tier.key}
          className={`rounded-2xl border p-6 ${
            tier.featured ? "border-brand-green shadow-lg" : "border-gray-200"
          }`}
        >
          {tier.featured && (
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-green">
              Most Popular
            </p>
          )}
          <p className="text-lg font-bold text-brand-black">{tier.name}</p>
          <p className="mt-2">
            <span className="text-3xl font-extrabold text-brand-black">{tier.price}</span>
            <span className="text-sm text-brand-gray">{tier.priceNote}</span>
          </p>
          <p className="mt-3 text-sm font-medium text-brand-green">{tier.evaluation}</p>
          <ul className="mt-4 space-y-2">
            {tier.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm text-brand-gray">
                <span className="text-brand-green">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <CheckoutButton
            productType="subscription"
            productKey={`${tier.key}_monthly`}
            className="mt-6 w-full text-center"
          >
            Choose {tier.name}
          </CheckoutButton>
        </div>
      ))}
    </div>
  );
}
