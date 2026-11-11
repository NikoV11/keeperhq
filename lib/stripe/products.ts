export type ProductType = "subscription" | "game_analysis" | "sc_program" | "sc_bundle" | "sc_custom";

type ProductDef = {
  priceEnvVar: string;
  mode: "subscription" | "payment";
  productType: Exclude<ProductType, "subscription"> | "subscription";
  plan?: "bronze" | "silver" | "gold";
};

export const PRODUCTS: Record<string, ProductDef> = {
  bronze_monthly: { priceEnvVar: "STRIPE_PRICE_BRONZE_MONTHLY", mode: "subscription", productType: "subscription", plan: "bronze" },
  silver_monthly: { priceEnvVar: "STRIPE_PRICE_SILVER_MONTHLY", mode: "subscription", productType: "subscription", plan: "silver" },
  gold_monthly: { priceEnvVar: "STRIPE_PRICE_GOLD_MONTHLY", mode: "subscription", productType: "subscription", plan: "gold" },

  game_analysis: { priceEnvVar: "STRIPE_PRICE_GAME_ANALYSIS", mode: "payment", productType: "game_analysis" },

  sc_explosive: { priceEnvVar: "STRIPE_PRICE_SC_EXPLOSIVE", mode: "payment", productType: "sc_program" },
  sc_fit: { priceEnvVar: "STRIPE_PRICE_SC_FIT", mode: "payment", productType: "sc_program" },
  sc_strong: { priceEnvVar: "STRIPE_PRICE_SC_STRONG", mode: "payment", productType: "sc_program" },
  sc_powerful: { priceEnvVar: "STRIPE_PRICE_SC_POWERFUL", mode: "payment", productType: "sc_program" },

  sc_bundle: { priceEnvVar: "STRIPE_PRICE_SC_BUNDLE", mode: "payment", productType: "sc_bundle" },
  sc_custom_onetime: { priceEnvVar: "STRIPE_PRICE_SC_CUSTOM_ONETIME", mode: "payment", productType: "sc_custom" },
  sc_custom_monthly: { priceEnvVar: "STRIPE_PRICE_SC_CUSTOM_MONTHLY", mode: "subscription", productType: "sc_custom" },
};

export function getProduct(productKey: string) {
  const def = PRODUCTS[productKey];
  if (!def) return null;
  const priceId = process.env[def.priceEnvVar];
  if (!priceId) return null;
  return { ...def, priceId };
}

// Reverse lookup used by the webhook to map a Stripe price back to a membership plan.
export function planFromPriceId(priceId: string): "bronze" | "silver" | "gold" | null {
  for (const def of Object.values(PRODUCTS)) {
    if (def.plan && process.env[def.priceEnvVar] === priceId) {
      return def.plan;
    }
  }
  return null;
}
