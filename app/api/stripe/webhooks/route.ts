import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/stripe/products";

type AdminClient = ReturnType<typeof createAdminClient>;

// supabase-js reports failures in `error` instead of throwing; without this check a failed
// write would still answer 200 and Stripe would never retry — a paid order silently lost.
function must<T extends { error: { message: string } | null }>(result: T, what: string): T {
  if (result.error) throw new Error(`${what}: ${result.error.message}`);
  return result;
}

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

  // Idempotency: Stripe retries deliveries, so claim the event id first. Only a
  // unique-violation means "already processed"; any other error must surface.
  const { error: claimError } = await supabase
    .from("stripe_events")
    .insert({ event_id: event.id, type: event.type });
  if (claimError) {
    if (claimError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error(`[stripe webhook] could not record ${event.type} ${event.id}`, claimError);
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  try {
    await handleEvent(stripe, supabase, event);
  } catch (err) {
    // Release the claim so Stripe's retry is processed instead of skipped as a duplicate.
    console.error(`[stripe webhook] failed to process ${event.type} ${event.id}`, err);
    await supabase.from("stripe_events").delete().eq("event_id", event.id);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(stripe: Stripe, supabase: AdminClient, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.supabase_user_id ?? session.client_reference_id;
      if (!userId) {
        console.warn(`[stripe webhook] checkout ${session.id} has no user id; ignoring`);
        return;
      }

      // One-time purchases, plus subscriptions that aren't membership tiers (the monthly
      // custom S&C plan), are recorded as orders; syncSubscription skips the latter.
      const productType = session.metadata?.product_type;
      if (session.mode === "payment" || (productType && productType !== "subscription")) {
        must(
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
          ),
          "save order"
        );
      }

      if (session.mode === "subscription" && typeof session.subscription === "string") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await syncSubscription(supabase, userId, subscription);
      }
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = await resolveUserId(supabase, subscription);
      if (userId) await syncSubscription(supabase, userId, subscription);
      return;
    }

    case "invoice.payment_failed": {
      // Current API versions moved the subscription id under invoice.parent.
      const invoice = event.data.object;
      const ref = invoice.parent?.subscription_details?.subscription;
      const subscriptionId = typeof ref === "string" ? ref : ref?.id;
      if (subscriptionId) {
        must(
          await supabase
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId),
          "mark subscription past_due"
        );
      }
      return;
    }
  }
}

async function resolveUserId(
  supabase: AdminClient,
  subscription: Stripe.Subscription
): Promise<string | null> {
  const fromMetadata = subscription.metadata?.supabase_user_id;
  if (fromMetadata) return fromMetadata;

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const { data } = must(
    await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle(),
    "look up customer"
  );

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

  const periodEnd = item?.current_period_end;

  must(
    await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        plan,
        status: subscription.status,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" }
    ),
    "save subscription"
  );
}
