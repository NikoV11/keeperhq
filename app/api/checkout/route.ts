import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { getProduct } from "@/lib/stripe/products";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You need to be logged in to purchase." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productKey = typeof body?.productKey === "string" ? body.productKey : null;
  const referralCode = typeof body?.referralCode === "string" ? body.referralCode : null;

  if (!productKey) {
    return NextResponse.json({ error: "Missing product." }, { status: 400 });
  }

  const product = getProduct(productKey);
  if (!product) {
    return NextResponse.json(
      { error: "This product isn't available for purchase yet." },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email, full_name")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    // Members can't write this column themselves (migration 0010), so save it with the
    // service-role key. Without it the webhook can't link later subscription events.
    const { error: saveError } = await createAdminClient()
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
    if (saveError) {
      console.error("[checkout] could not save stripe_customer_id", saveError);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  // Validate the referral code server-side; never trust a client-supplied discount.
  let discounts: { promotion_code: string }[] | undefined;
  if (referralCode) {
    const { data: code } = await supabase
      .from("referral_codes")
      .select("code, active, applies_to, expires_at")
      .eq("code", referralCode.toUpperCase())
      .eq("active", true)
      .maybeSingle();

    const notExpired = !code?.expires_at || new Date(code.expires_at) > new Date();
    const appliesToProduct = code?.applies_to?.includes(product.productType);

    if (code && notExpired && appliesToProduct) {
      const promos = await stripe.promotionCodes.list({ code: code.code, active: true, limit: 1 });
      const promoId = promos.data[0]?.id;
      if (promoId) discounts = [{ promotion_code: promoId }];
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: product.mode,
    customer: customerId,
    line_items: [{ price: product.priceId, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id, product_type: product.productType, product_key: productKey },
    ...(product.mode === "subscription"
      ? { subscription_data: { metadata: { supabase_user_id: user.id, product_key: productKey } } }
      : {}),
    ...(discounts ? { discounts } : { allow_promotion_codes: true }),
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url: `${siteUrl}/packages?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
