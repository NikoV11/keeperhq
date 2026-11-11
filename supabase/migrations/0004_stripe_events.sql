-- Webhook idempotency ledger: Stripe retries deliveries, so each event id is
-- inserted once and a duplicate insert signals "already processed".
create table public.stripe_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
-- No policies: only the service-role webhook handler touches this table.

-- Stripe emits more statuses than the initial CHECK allowed (incomplete,
-- incomplete_expired, paused). Widen it so webhook syncs can't fail on a valid status.
alter table public.subscriptions drop constraint subscriptions_status_check;

alter table public.subscriptions add constraint subscriptions_status_check
  check (status in (
    'trialing', 'active', 'past_due', 'canceled', 'unpaid',
    'incomplete', 'incomplete_expired', 'paused'
  ));
