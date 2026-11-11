# KeeperHQ

Online goalkeeper development platform — technical training library, membership tiers with
1-on-1 coach evaluations, game video analysis, and strength & conditioning (KeeperHQ x TAP).

**Develop Your Game. Anywhere. Anytime.**

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Supabase** — Postgres, Auth, Storage (member clips, training videos, CVs)
- **Stripe** — Checkout, Customer Portal, webhooks
- **Cal.com** (free tier) — Zoom call scheduling, embedded
- **Resend** (free tier) — contact form notifications

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values (see below)
npm run dev
```

The app **will not run until Supabase credentials are set** — every route reads the auth
session. See the setup checklist below.

## Setup checklist

Work through these in order. Each phase is independently testable.

### 1. Supabase (required to run at all)

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API: copy `Project URL`, `anon` key, and `service_role` key into
   `.env.local`.
3. Run the migrations in `supabase/migrations/` **in filename order** — either paste each
   into the Supabase SQL editor, or use the CLI:
   ```bash
   npx supabase link --project-ref <your-ref>
   npx supabase db push
   ```
   This creates every table, all RLS policies, the `media` storage bucket, and seeds
   `app_config`.
4. Verify: `npm run dev`, then register an account at `/register` and confirm you land on
   `/dashboard`.

> Tip: for local development, turn **off** email confirmation in Authentication →
> Providers → Email so you can register without checking an inbox.

### 2. Make yourself a coach

The coach console (`/coach`) is role-gated. After registering, promote your account in the
Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

### 3. Stripe

1. Create a [Stripe](https://stripe.com) account and stay in **test mode** for now.
2. Create Products/Prices and copy each price ID into `.env.local`:

   | Env var | Product | Price |
   |---|---|---|
   | `STRIPE_PRICE_BRONZE_MONTHLY` | Bronze membership | $12.99/mo recurring |
   | `STRIPE_PRICE_SILVER_MONTHLY` | Silver membership | $44.99/mo recurring |
   | `STRIPE_PRICE_GOLD_MONTHLY` | Gold membership | $59.99/mo recurring |
   | `STRIPE_PRICE_GAME_ANALYSIS` | Game Video Analysis | $39.99 one-time |
   | `STRIPE_PRICE_SC_EXPLOSIVE` / `_FIT` / `_STRONG` / `_POWERFUL` | S&C programs | one-time (TAP pricing TBD) |
   | `STRIPE_PRICE_SC_BUNDLE` | All 4 S&C programs | one-time (TBD) |
   | `STRIPE_PRICE_SC_CUSTOM_ONETIME` | Custom S&C plan | one-time (TBD) |
   | `STRIPE_PRICE_SC_CUSTOM_MONTHLY` | Custom S&C plan | monthly (TBD) |

3. Copy the publishable + secret keys into `.env.local`.
4. Forward webhooks locally and copy the printed signing secret into
   `STRIPE_WEBHOOK_SECRET`:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```
   In production, register `https://yourdomain.com/api/stripe/webhooks` in the Stripe
   dashboard instead and use that endpoint's signing secret.
5. Verify: buy Silver with test card `4242 4242 4242 4242`. Your plan on
   `/dashboard/account` should flip to Silver once the webhook fires.

### 4. Cal.com (scheduling — free tier, no subscription needed)

Create a free **Individual** account for each coach, set up their event types ("Free Intro
Call", "Evaluation Zoom"), then put each username in `NEXT_PUBLIC_CALCOM_STEFAN`,
`NEXT_PUBLIC_CALCOM_JACK`, `NEXT_PUBLIC_CALCOM_PAUL`. Until these are set, booking areas
show a "scheduling isn't configured yet" placeholder instead of breaking.

### 5. Resend (contact form emails)

Create a [Resend](https://resend.com) account, grab an API key, and set
`CONTACT_NOTIFICATION_EMAIL` to wherever enquiries should land. Contact messages are always
saved to the `contact_messages` table — email is only the notification, so a missing key
never loses a message. Verify your own domain in Resend to send `from` a KeeperHQ address.

### 6. Deploy (Vercel)

Push to GitHub, import the repo at [vercel.com](https://vercel.com), and add **every**
variable from `.env.local.example` to both Preview and Production. Set
`NEXT_PUBLIC_SITE_URL` to the real domain so Stripe redirects land correctly.

## Core product loop

The blueprint's Train → Record → Evaluate → Improve cycle is wired end-to-end:

1. A Silver/Gold member uploads up to 3 clips at `/dashboard/upload`
   (the 3-per-cycle cap is enforced by a database trigger, not just the UI).
2. A coach sees them grouped by member at `/coach` and clicks **Open Evaluation**, which
   creates the evaluation and links the pending clips to it.
3. The coach watches the clips and writes feedback at `/coach/evaluations/[id]`, then marks
   it complete.
4. The member reads the feedback at `/dashboard/evaluations`. Bronze members see an upgrade
   prompt there instead; Silver members see a nudge toward Gold.

## Where content lives

Marketing copy and placeholder assets are plain typed files — swapping in final content
needs no code changes:

| File | Contains |
|---|---|
| `content/site.ts` | Tagline, nav, footer, operating hours, training categories |
| `content/team.ts` | Stefan / Jack / Paul bios, photos, CV links |
| `content/packages.ts` | Bronze/Silver/Gold display copy |
| `content/sc-programs.ts` | S&C program names, focus, price ranges |
| `content/testimonials.ts` | Video + written testimonials, "goalkeepers we've worked with" |
| `content/legal.ts` | All six legal/policy documents |

Values that should change without a redeploy (operating hours, display pricing, intro video
path) live in the `app_config` table; S&C discount codes live in `referral_codes`.

## Still to add before launch

Per the blueprint's "Materials Still to Add": final logo files, team photos, Stefan's/Jack's/
Paul's CVs, the intro video, testimonial videos, approved goalkeeper references, final TAP
pricing and the updated referral code (currently seeded as `OGS20`), final operating hours,
social links, and **legal text reviewed by a lawyer** — everything in `content/legal.ts` is
a structural placeholder only.
