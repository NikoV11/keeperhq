import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/stripe/products";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Idempotency: skip events we've already processed (Stripe retries deliveries).
  const { error: dupeError } = await supabase
    .from("stripe_events")
    .insert({ event_id: event.id, type: event.type });
  if (dupeError) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.supabase_user_id ?? session.client_reference_id;
      if (!userId) break;

      if (session.mode === "payment") {
        await supabase.from("orders").upsert(
          {
            user_id: userId,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            product_type: session.metadata?.product_type ?? "game_analysis",
            product_key: session.metadata?.product_key ?? "unknown",
            amount_cents: session.amount_total ?? 0,
            status: "paid",
          },
          { onConflict: "stripe_checkout_session_id" }
        );
      }

      if (session.mode === "subscription" && typeof session.subscription === "string") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await syncSubscription(supabase, userId, subscription);
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = await resolveUserId(supabase, subscription);
      if (userId) await syncSubscription(supabase, userId, subscription);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null };
      if (typeof invoice.subscription === "string") {
        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", invoice.subscription);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function resolveUserId(
  supabase: AdminClient,
  subscription: Stripe.Subscription
): Promise<string | null> {
  const fromMetadata = subscription.metadata?.supabase_user_id;
  if (fromMetadata) return fromMetadata;

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

async function syncSubscription(
  supabase: AdminClient,
  userId: string,
  subscription: Stripe.Subscription
) {
  const item = subscription.items.data[0];
  const priceId = item?.price.id;
  const plan = priceId ? planFromPriceId(priceId) : null;

  // Non-membership subscriptions (e.g. the monthly S&C custom plan) are tracked as
  // orders, not membership tiers, so they must not write a plan row.
  if (!plan) return;

  const status = subscription.status === "canceled" ? "canceled" : subscription.status;
  const periodEnd = item?.current_period_end;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      plan,
      status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}
