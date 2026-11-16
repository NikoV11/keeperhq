-- KeeperHQ initial schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)

-- =========================================================================
-- profiles
-- =========================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'coach', 'admin')),
  full_name text,
  email text,
  dob date,
  country text,
  parent_name text,
  parent_email text,
  parent_phone text,
  accepted_terms_at timestamptz,
  accepted_privacy_at timestamptz,
  accepted_waiver_at timestamptz,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security-definer helper avoids RLS recursion when policies need to check role
create function public.is_coach_or_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role in ('coach', 'admin')
  );
$$;

create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

-- auto-create a profile row when a new auth user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- subscriptions (Bronze/Silver/Gold, mirrored from Stripe; webhook-only writes)
-- =========================================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan text not null check (plan in ('bronze', 'silver', 'gold')),
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own_or_staff"
  on public.subscriptions for select
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

-- intentionally no insert/update/delete policies for authenticated/anon roles;
-- all writes happen server-side via the service-role key in the Stripe webhook handler.

create index subscriptions_user_id_idx on public.subscriptions(user_id);

-- =========================================================================
-- orders (one-time purchases: game analysis, S&C program/bundle/custom)
-- =========================================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  product_type text not null check (product_type in ('game_analysis', 'sc_program', 'sc_bundle', 'sc_custom')),
  product_key text not null,
  amount_cents integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own_or_staff"
  on public.orders for select
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create index orders_user_id_idx on public.orders(user_id);

-- =========================================================================
-- training_videos (Training Library catalog)
-- =========================================================================
create table public.training_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in (
    'handling', 'set_position', 'diving', 'crosses', 'distribution', 'passing', 'indoor', 'outdoor'
  )),
  sub_type text check (sub_type in ('individual', 'partner')),
  storage_path text not null,
  thumbnail_path text,
  duration_seconds integer,
  is_free_trial boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.training_videos enable row level security;

create policy "training_videos_select_free_trial_public"
  on public.training_videos for select
  using (published = true and is_free_trial = true);

create policy "training_videos_select_authenticated"
  on public.training_videos for select
  using (published = true and auth.uid() is not null);

create policy "training_videos_write_staff"
  on public.training_videos for all
  using (public.is_coach_or_admin(auth.uid()))
  with check (public.is_coach_or_admin(auth.uid()));

-- =========================================================================
-- favorites
-- =========================================================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  video_id uuid not null references public.training_videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);

alter table public.favorites enable row level security;

create policy "favorites_all_own"
  on public.favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- =========================================================================
-- training_plans / training_plan_items
-- =========================================================================
create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.training_plans enable row level security;

create policy "training_plans_select_own_or_staff"
  on public.training_plans for select
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create policy "training_plans_write_own_or_staff"
  on public.training_plans for insert
  with check (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create policy "training_plans_update_own_or_staff"
  on public.training_plans for update
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create table public.training_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  video_id uuid not null references public.training_videos(id) on delete cascade,
  sort_order integer not null default 0,
  done boolean not null default false
);

alter table public.training_plan_items enable row level security;

create policy "training_plan_items_select_via_plan"
  on public.training_plan_items for select
  using (
    exists (
      select 1 from public.training_plans p
      where p.id = plan_id and (p.user_id = auth.uid() or public.is_coach_or_admin(auth.uid()))
    )
  );

create policy "training_plan_items_write_via_plan"
  on public.training_plan_items for all
  using (
    exists (
      select 1 from public.training_plans p
      where p.id = plan_id and (p.user_id = auth.uid() or public.is_coach_or_admin(auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.training_plans p
      where p.id = plan_id and (p.user_id = auth.uid() or public.is_coach_or_admin(auth.uid()))
    )
  );

-- =========================================================================
-- evaluations (coach feedback loop) + uploaded_clips
-- =========================================================================
create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid references public.profiles(id),
  cycle_start date not null,
  cycle_end date not null,
  status text not null default 'pending' check (status in ('pending', 'in_review', 'completed')),
  feedback_text text,
  feedback_video_path text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.evaluations enable row level security;

create policy "evaluations_select_own_or_staff"
  on public.evaluations for select
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create policy "evaluations_write_staff"
  on public.evaluations for all
  using (public.is_coach_or_admin(auth.uid()))
  with check (public.is_coach_or_admin(auth.uid()));

create index evaluations_user_id_idx on public.evaluations(user_id);
create index evaluations_status_idx on public.evaluations(status);

create table public.uploaded_clips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  evaluation_id uuid references public.evaluations(id) on delete set null,
  storage_path text not null,
  original_filename text,
  file_size_bytes bigint,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.uploaded_clips enable row level security;

create policy "uploaded_clips_select_own_or_staff"
  on public.uploaded_clips for select
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create policy "uploaded_clips_insert_own"
  on public.uploaded_clips for insert
  with check (user_id = auth.uid());

create policy "uploaded_clips_update_staff"
  on public.uploaded_clips for update
  using (public.is_coach_or_admin(auth.uid()));

-- =========================================================================
-- sc_questionnaire_responses
-- =========================================================================
create table public.sc_questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  gk_level text,
  injury_flags text[],
  equipment text[],
  weekly_training_days integer,
  recommended_program text,
  upgraded_to_custom boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.sc_questionnaire_responses enable row level security;

create policy "sc_questionnaire_select_own_or_staff"
  on public.sc_questionnaire_responses for select
  using (user_id = auth.uid() or public.is_coach_or_admin(auth.uid()));

create policy "sc_questionnaire_insert_own"
  on public.sc_questionnaire_responses for insert
  with check (user_id = auth.uid());

-- =========================================================================
-- contact_messages (Contact page + Chat-With-Us widget)
-- =========================================================================
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  gk_age integer,
  country text,
  club_school text,
  playing_level text,
  interest text check (interest in (
    'bronze', 'silver', 'gold', 'game_analysis', 'sc', 'free_trial', 'general'
  )),
  message text not null,
  source text not null check (source in ('contact_page', 'chat_widget')),
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_insert_anyone"
  on public.contact_messages for insert
  with check (true);

create policy "contact_messages_select_staff"
  on public.contact_messages for select
  using (public.is_coach_or_admin(auth.uid()));

create policy "contact_messages_update_staff"
  on public.contact_messages for update
  using (public.is_coach_or_admin(auth.uid()));

-- =========================================================================
-- app_config (singleton-style key/value config)
-- =========================================================================
create table public.app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

create policy "app_config_select_public"
  on public.app_config for select
  using (true);

create policy "app_config_write_admin"
  on public.app_config for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =========================================================================
-- referral_codes (S&C discounts)
-- =========================================================================
create table public.referral_codes (
  code text primary key,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric not null,
  active boolean not null default true,
  applies_to text[] not null default '{}',
  expires_at timestamptz
);

alter table public.referral_codes enable row level security;

create policy "referral_codes_select_public"
  on public.referral_codes for select
  using (true);

create policy "referral_codes_write_admin"
  on public.referral_codes for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =========================================================================
-- seed: starter config + a placeholder referral code (replace before launch)
-- =========================================================================
insert into public.app_config (key, value) values
  ('operating_hours', '{"note": "Final hours TBD", "timezone": "America/New_York"}'),
  ('intro_video_path', '"placeholder/intro-video.mp4"'),
  ('pricing', '{
    "bronze_monthly": 14.99,
    "silver_monthly": 39.99,
    "gold_monthly": 59.99,
    "game_analysis": 39.99,
    "sc_explosive": 30,
    "sc_fit": 30,
    "sc_strong": 30,
    "sc_powerful": 30,
    "sc_bundle": 90,
    "sc_custom_onetime": 100,
    "sc_custom_monthly": 50
  }');

insert into public.referral_codes (code, discount_type, discount_value, applies_to)
values ('OGS20', 'percent', 20, '{sc_program,sc_bundle,sc_custom}');
