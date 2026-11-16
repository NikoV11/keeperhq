# KeeperHQ — Owner's Guide

Welcome to your KeeperHQ website. This guide gets you set up and shows you how to run
everything yourself.

**You do not need to know how to code.** You'll be creating accounts on a few services and
copying some keys between them. Take it slowly — nothing here can break the website.

---

## Part 1 — What you'll be setting up

Your website uses five free services. Here's what each one does:

| Service | What it does | Cost |
|---|---|---|
| **Supabase** | Stores your videos, members, and all your content | Free to start |
| **Vercel** | Puts your website on the internet | Free to start |
| **Stripe** | Takes payments from members | Free; takes a small % per payment |
| **Cal.com** | Lets people book Zoom calls with you | Free |
| **Resend** | Emails you when someone sends a message | Free |

You can do Supabase and Vercel first to get the site online, then add Stripe, Cal.com, and
Resend whenever you're ready. **The site works without them** — payments and bookings just
stay switched off until you connect them.

> **Keep a notes file open.** You'll be copying about a dozen keys. Paste each one into a
> note as you go, labelled, so you can find it later.

---

## Part 2 — Setting up Supabase (required)

This is your database. It holds your training videos, your members, and your website text.

1. Go to **[supabase.com](https://supabase.com)** and sign up (free).
2. Click **New project**. Give it the name `keeperhq`, create a database password (save it in
   your notes), pick the region closest to you, and click **Create new project**. Wait about
   two minutes.
3. In the left sidebar click the **gear icon (Project Settings)** → **API keys**. Copy these
   three values into your notes:
   - **Project URL**
   - **anon public** key
   - **service_role** key — *treat this one like a password, never share it*
4. Now set up your database tables. In the left sidebar click **SQL Editor** → **New query**.
5. Open the folder `supabase/migrations` in this project. You'll see eight files numbered
   `0001` to `0008`. **One at a time, in order**: open the file, copy all of its text, paste
   it into the SQL Editor, and click **Run**. Wait for "Success" before moving to the next.

   The last one loads your 34 real testimonials, so they'll be on your site straight away.

   > Order matters. If you get an error, you likely skipped one or ran them out of order.

6. Turn off email confirmation so people can sign up without checking their inbox. Go to
   **Authentication** → **Sign In / Up** → **Email** and switch off **Confirm email**. (You can
   turn this back on later if you prefer.)

Supabase is done. ✅

---

## Part 3 — Putting your site online with Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign up with GitHub.
2. Click **Add New → Project** and pick this project's repository.
3. Before clicking Deploy, open **Environment Variables** and add these three:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Project URL from Part 2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key |

4. Click **Deploy** and wait a couple of minutes. You'll get a web address like
   `keeperhq.vercel.app` — **your website is now live.**
5. Add one more environment variable now that you know your address: `NEXT_PUBLIC_SITE_URL`
   set to your full address (for example `https://keeperhq.vercel.app`). Then go to the
   **Deployments** tab and click **Redeploy** on the most recent one.

### Connecting your own domain

Once you own `keeperhq.com` (or similar), go to your Vercel project → **Settings** →
**Domains** → **Add**, and follow the instructions. Then update `NEXT_PUBLIC_SITE_URL` to
your real domain and redeploy.

---

## Part 4 — Making yourself the owner

Right now nobody can manage the site. Let's fix that.

1. Go to your live website and click **Register**. Sign up with your real email.
2. Go back to Supabase → **SQL Editor** → **New query**, paste the line below (swap in your
   email), and click **Run**:

   ```sql
   update public.profiles set role = 'admin' where email = 'your@email.com';
   ```

3. Go back to your website and visit **`your-site.com/admin`**.

**You now have a Website Manager.** This is where you control everything — skip to
[Part 8](#part-8--running-your-website) to see what you can do there.

Do the same for each coach, but use `'coach'` instead of `'admin'`, so they can review
clips and write evaluations without being able to change your prices.

---

## Part 5 — Taking payments with Stripe

Skip this until you're ready to charge people. The site works fine without it — the
purchase buttons just won't complete.

1. Sign up at **[stripe.com](https://stripe.com)**.
2. Leave **Test mode** switched ON (the toggle at the top right) while you set this up. In
   test mode you can practise buying things with fake cards and no real money moves.
3. Go to **Product catalogue** → **Add product**. You need to create one product for each
   thing you sell. For each: enter the name, set the price, choose **Recurring → Monthly**
   for memberships or **One-off** for everything else, then save. Afterwards click into the
   product and copy its **Price ID** (it starts with `price_`).

   | Product name | Price | Type |
   |---|---|---|
   | Bronze Membership | $14.99 | Monthly |
   | Silver Membership | $39.99 | Monthly |
   | Gold Membership | $59.99 | Monthly |
   | Game Video Analysis | $39.99 | One-off |
   | Explosive GK | your price | One-off |
   | Fit GK | your price | One-off |
   | Strong GK | your price | One-off |
   | Powerful GK | your price | One-off |
   | All 4 GK Programs | your price | One-off |
   | Custom S&C Plan | your price | One-off |
   | Custom S&C Plan (monthly) | your price | Monthly |

4. Go to **Developers** → **API keys** and copy your **Secret key**.
5. Go to **Developers** → **Webhooks** → **Add endpoint**. For the URL enter
   `https://your-site.com/api/stripe/webhooks`. Under events to send, choose **Select all**
   (or at minimum the `checkout.session.completed`, `customer.subscription.*`, and
   `invoice.payment_failed` events). Save, then copy the **Signing secret**.

   > This webhook is what tells your website someone has paid. Without it, people get
   > charged but don't get access.

6. In Vercel → **Settings** → **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `STRIPE_SECRET_KEY` | Your secret key |
   | `STRIPE_WEBHOOK_SECRET` | The signing secret from step 5 |
   | `STRIPE_PRICE_BRONZE_MONTHLY` | Bronze Price ID |
   | `STRIPE_PRICE_SILVER_MONTHLY` | Silver Price ID |
   | `STRIPE_PRICE_GOLD_MONTHLY` | Gold Price ID |
   | `STRIPE_PRICE_GAME_ANALYSIS` | Game Analysis Price ID |
   | `STRIPE_PRICE_SC_EXPLOSIVE` | Explosive GK Price ID |
   | `STRIPE_PRICE_SC_FIT` | Fit GK Price ID |
   | `STRIPE_PRICE_SC_STRONG` | Strong GK Price ID |
   | `STRIPE_PRICE_SC_POWERFUL` | Powerful GK Price ID |
   | `STRIPE_PRICE_SC_BUNDLE` | Bundle Price ID |
   | `STRIPE_PRICE_SC_CUSTOM_ONETIME` | Custom plan Price ID |
   | `STRIPE_PRICE_SC_CUSTOM_MONTHLY` | Custom monthly Price ID |

7. Redeploy (Deployments → Redeploy).
8. **Test it.** On your site, buy a Silver membership using card number
   `4242 4242 4242 4242`, any future expiry date, and any 3-digit code. Then check
   **My Account** on your dashboard — it should say Silver.

### Going live for real

When you're ready to take real money: switch **Test mode** OFF in Stripe, complete their
business verification, then repeat steps 3–7 with your live keys (you'll need to recreate
the products and the webhook in live mode — test and live are completely separate).

---

## Part 6 — Zoom call bookings with Cal.com

1. Each coach (Stefan and Paul) signs up free at **[cal.com](https://cal.com)** and picks a
   username.
2. Set up the call types you offer — for example a 30-minute "Free Intro Call" and a
   30-minute "Evaluation Zoom". Connect Zoom in Cal.com's **Apps** section.
3. In your Website Manager, go to **Site Text & Hours** → **Booking links** and type each
   coach's Cal.com username. Save.

Booking calendars appear on your site immediately. Until you do this, those sections invite
visitors to message you instead.

---

## Part 7 — Message notification emails

Messages from your contact form are **always** saved and visible in your Website Manager
under **Messages**. This step just adds an email alert so you don't have to keep checking.

1. Sign up at **[resend.com](https://resend.com)** and copy your **API key**.
2. In Vercel, add two environment variables: `RESEND_API_KEY` (your key) and
   `CONTACT_NOTIFICATION_EMAIL` (where alerts should go). Redeploy.

---

## Part 8 — Running your website

Everything below is done at **`your-site.com/admin`**. Changes appear on your live site
immediately — no redeploying, no developer.

### Training Videos

Your library. **Upload Video** adds one: choose the file, give it a title and category, and
save. Large files take a few minutes — don't close the page while it uploads.

Tick **Free sample** on up to three videos. Those are the ones visitors can watch before
paying, and they show on your homepage. Tick **Visible on the website** off to hide a video
while you're still working on it.

### Team & Coaches

Each coach's photo, bio, CV (as a PDF), languages, and booking link. The sections — About,
Playing Career, Coaching Career and so on — are exactly what appears on their profile page.
**Leave a section's text empty and it disappears** from the page.

### Testimonials & Goalkeepers

Your 34 testimonials are already loaded here, split into **Goalkeepers**, **Coaches**, and
**Parents**. Each has a photo, a background/career list, and the quote exactly as it was
submitted.

Tick **Featured** on your best two or three to choose what shows on the homepage. Right now
that's Enrique Bösl, Jack Hobday, and Dennis Hill — change it to whoever you prefer.

**Goalkeepers in this list also fill the "Goalkeepers We Have Worked With" section**, so you
only ever enter a person once. A goalkeeper with no quote still appears as a track-record
card.

Only add someone's photo, name, or quote if you have their permission — and a parent's
permission if they're under 18.

### Membership Prices & S&C Programs

Edit the prices and feature lists visitors see.

> ⚠️ **This only changes the text on your website.** To change what members are actually
> charged you must also update the price in Stripe. Always change both, or your site will
> advertise one price and charge another.

### Site Text & Hours

Your tagline, homepage wording, contact email, operating hours, social media links, booking
usernames, and the homepage introduction video.

### Legal Pages

Your terms, privacy policy, waiver, and other policies.

> ⚠️ **The text currently in these pages is a placeholder written as an example.** Have a
> lawyer review your real policies before you take payments — especially the Liability
> Waiver and Privacy Policy, since you collect information about children.

### Discount Codes

Codes customers type at checkout. A code must exist **in both places** to work: create a
promotion code in Stripe (*Product catalogue → Coupons*) with the exact same code text, then
add it here.

### Messages

Everyone who contacted you, newest first. New ones are highlighted. **Reply by email** opens
your email program; mark messages as read or replied to keep track.

### Members

Everyone registered, and what plan they're on. Use the dropdown to make someone a **Coach**
(can review clips and write evaluations) or an **Admin** (can also use this Website Manager).
You can't remove your own admin access, so you can't accidentally lock yourself out.

---

## Part 9 — The coaching workflow

This is the loop at the heart of KeeperHQ:

1. A Silver or Gold member uploads up to 3 clips from their dashboard.
2. A coach opens **`your-site.com/coach`** and sees them grouped by member.
3. The coach clicks **Open Evaluation**, watches the clips, writes feedback, and clicks
   **Submit & Mark Complete**.
4. The member sees that feedback in **My Evaluations**, and can upload their next 3 clips.

Bronze members see an upgrade prompt instead of the upload page. Silver members get a nudge
toward Gold.

---

## Questions and answers

**Can I break the website by editing something?**
No. Everything in the Website Manager can be edited again. The only things to be careful
with are prices (keep them matching Stripe) and legal text.

**Do I need to redeploy after changing content?**
No. Content changes are live instantly. You only redeploy after changing environment
variables in Vercel.

**Someone paid but didn't get access.**
Your Stripe webhook isn't working. In Stripe → **Developers → Webhooks**, click your endpoint
and look at recent deliveries for errors. Usually the URL is wrong or
`STRIPE_WEBHOOK_SECRET` doesn't match.

**Can members see each other's information or videos?**
No. The database enforces this, not just the screens — members can only ever read their own
clips, evaluations, and account. Coaches see what they need for evaluations.

**Where do member clips go?**
Into private storage. Only the member who uploaded a clip and your coaches can view it.
Training videos are private too, so non-members can't watch them.

**How do I get my site off the `.vercel.app` address?**
See "Connecting your own domain" at the end of Part 3.

---

## Before you launch — checklist

- [ ] All eight migration files run in Supabase, in order
- [ ] Your admin account works at `/admin`
- [ ] Real training videos uploaded, with up to 3 marked as free samples
- [ ] Team photos, bios, and CVs added
- [ ] Benjamin Flicker's quote added, and Iker's surname filled in (both were pending)
- [ ] Permission confirmed for everyone shown in Testimonials
- [ ] Photos added for Alexis Vizarelis, Jamie Peterson, Heather, Adam, and Mason's father
      (Anthony H and Jennifer Jackson asked not to have photos)
- [ ] Prices in the Website Manager match your prices in Stripe
- [ ] Stripe tested with the test card, then switched to live mode
- [ ] Cal.com usernames added so people can book calls
- [ ] Operating hours and contact email filled in
- [ ] **Legal pages replaced with text a lawyer has reviewed**
- [ ] Your own domain connected
