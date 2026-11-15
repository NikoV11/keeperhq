-- Move every piece of client-editable content out of code files and into the database
-- so the KeeperHQ team can manage the site from /admin without a developer.

-- Admin-only check (distinct from is_coach_or_admin, which coaches also pass).
create function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

-- Admins manage roles from /admin/members; the base policy only allowed self-updates.
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Shared policy shape: everyone can read published content, only admins can write.
-- =========================================================================
-- team_members
-- =========================================================================
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role_title text not null,
  short_bio text,
  photo_path text,
  cv_path text,
  cal_username text,
  languages text[] not null default '{}',
  sections jsonb not null default '[]',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

create policy "team_members_select_public" on public.team_members
  for select using (true);
create policy "team_members_write_admin" on public.team_members
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- testimonials (video and written in one table, distinguished by kind)
-- =========================================================================
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('video', 'written')),
  name text not null,
  affiliation text,
  age integer,
  quote text,
  video_path text,
  thumbnail_path text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "testimonials_select_public" on public.testimonials
  for select using (published = true);
create policy "testimonials_write_admin" on public.testimonials
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- goalkeepers ("Goalkeepers We Have Worked With")
-- =========================================================================
create table public.goalkeepers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  affiliation text,
  level text,
  coach text,
  quote text,
  photo_path text,
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.goalkeepers enable row level security;

create policy "goalkeepers_select_public" on public.goalkeepers
  for select using (published = true);
create policy "goalkeepers_write_admin" on public.goalkeepers
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- legal_documents
-- =========================================================================
create table public.legal_documents (
  slug text primary key,
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.legal_documents enable row level security;

create policy "legal_documents_select_public" on public.legal_documents
  for select using (true);
create policy "legal_documents_write_admin" on public.legal_documents
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- membership_packages (Bronze/Silver/Gold display copy + price)
-- =========================================================================
create table public.membership_packages (
  key text primary key check (key in ('bronze', 'silver', 'gold')),
  name text not null,
  price_display text not null,
  price_note text not null default '/month',
  evaluation_note text,
  features text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.membership_packages enable row level security;

create policy "membership_packages_select_public" on public.membership_packages
  for select using (true);
create policy "membership_packages_write_admin" on public.membership_packages
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- sc_programs (KeeperHQ x TAP programs, incl. bundle and custom)
-- =========================================================================
create table public.sc_programs (
  key text primary key,
  title text not null,
  focus text,
  price_display text,
  category text not null default 'program' check (category in ('program', 'bundle', 'custom')),
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.sc_programs enable row level security;

create policy "sc_programs_select_public" on public.sc_programs
  for select using (published = true);
create policy "sc_programs_write_admin" on public.sc_programs
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- Storage: paid content stays in the private 'media' bucket. Marketing assets
-- (team photos, CVs, testimonial videos, the intro video) are genuinely public,
-- so they get their own public bucket — no signed URLs to expire, and the CDN
-- can cache them.
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

create policy "public_media_admin_write" on storage.objects
  for all using (bucket_id = 'public-media' and public.is_admin(auth.uid()))
  with check (bucket_id = 'public-media' and public.is_admin(auth.uid()));

-- Admins manage everything in the private bucket too (training video uploads).
create policy "media_admin_all" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin(auth.uid()))
  with check (bucket_id = 'media' and public.is_admin(auth.uid()));

-- Admins may update/delete training video rows alongside coaches.
create policy "training_videos_delete_staff" on public.training_videos
  for delete using (public.is_coach_or_admin(auth.uid()));

-- =========================================================================
-- Seed the current placeholder content so the site looks identical after
-- this migration and the team can edit it from /admin.
-- =========================================================================
insert into public.team_members (slug, name, role_title, short_bio, photo_path, languages, sections, sort_order) values
('stefan', 'Stefan Schenk', 'General Manager | Goalkeeper Coach',
 'Goalkeeper coach and General Manager of KeeperHQ, focused on structured technical development for goalkeepers at every level.',
 '/images/placeholder/team-stefan.svg', '{English}',
 '[{"heading":"About","body":"Full bio pending — to be supplied before launch."},
   {"heading":"Playing Career","body":"Playing career details pending."},
   {"heading":"Coaching Career","body":"Coaching career details pending."},
   {"heading":"Education","body":"Education details pending."},
   {"heading":"Qualifications & Certifications","body":"Qualifications pending."},
   {"heading":"Achievements","body":"Achievements pending."},
   {"heading":"References","body":"References pending approval."}]', 1),
('jack', 'Jack', 'CEO | Goalkeeper Coach',
 'Co-founder and CEO of KeeperHQ, bringing the goalkeeper-specific coaching philosophy behind the platform.',
 '/images/placeholder/team-jack.svg', '{English}',
 '[{"heading":"About","body":"Full bio and surname pending — to be supplied before launch."},
   {"heading":"Playing Career","body":"Playing career details pending."},
   {"heading":"Coaching Career","body":"Coaching career details pending."},
   {"heading":"Education & Qualifications","body":"Education and qualifications pending."},
   {"heading":"References","body":"References pending approval."}]', 2),
('paul', 'Paul Olla', 'Strength & Conditioning | Train.Adapt.Peak',
 'Strength and conditioning coach behind Train.Adapt.Peak (TAP), delivering goalkeeper-specific physical development for KeeperHQ.',
 '/images/placeholder/team-paul.svg', '{}',
 '[{"heading":"About","body":"Full bio pending — to be supplied before launch."},
   {"heading":"Certifications","body":"S&C certifications pending."},
   {"heading":"S&C / Athletic Experience","body":"Experience details pending."}]', 3);

insert into public.testimonials (kind, name, affiliation, quote, thumbnail_path, featured, sort_order) values
('video', 'Goalkeeper name pending', 'Club / College pending', 'Testimonial quote pending approval.', '/images/placeholder/testimonial.svg', true, 1),
('video', 'Goalkeeper name pending', 'Club / College pending', 'Testimonial quote pending approval.', '/images/placeholder/testimonial.svg', true, 2),
('video', 'Parent name pending', 'Parent testimonial', 'Testimonial quote pending approval.', '/images/placeholder/testimonial.svg', true, 3),
('written', 'Name pending', 'Club / College pending', 'Written testimonial pending approval before launch.', null, false, 1),
('written', 'Name pending', 'Parent', 'Written testimonial pending approval before launch.', null, false, 2);

insert into public.goalkeepers (name, affiliation, level, coach, photo_path, sort_order)
select 'Goalkeeper name pending', 'Club / College pending', 'Playing level pending', 'Coach pending',
       '/images/placeholder/goalkeeper.svg', g
from generate_series(1, 6) as g;

insert into public.legal_documents (slug, title, body, sort_order) values
('terms', 'Terms & Conditions',
 E'This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.\n\nThese terms will cover acceptable use of the KeeperHQ platform, membership obligations, intellectual property in the training library, and the conditions under which accounts may be suspended.', 1),
('privacy', 'Privacy Policy',
 E'This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.\n\nThis policy will describe what personal data KeeperHQ collects (including data about minors and parent/guardian details), how uploaded training footage is stored and who can access it, the third-party processors involved, and how to request deletion of your data.', 2),
('waiver', 'Liability Waiver',
 E'This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.\n\nThis waiver will cover the physical risks inherent in goalkeeper training and strength and conditioning work, the requirement to train within your own physical limits, and the recommendation to obtain medical clearance before beginning any program.', 3),
('cancellation', 'Cancellation Policy',
 E'This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.\n\nThis policy will set out how to cancel a Bronze, Silver, or Gold membership, when cancellation takes effect relative to the billing period, and how to reschedule or cancel a booked Zoom evaluation.', 4),
('refunds', 'Refund Policy',
 E'This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.\n\nThis policy will set out the circumstances in which membership payments, Game Video Analysis purchases, and Strength & Conditioning program purchases may be refunded.', 5),
('cookies', 'Cookie Policy',
 E'This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.\n\nThis policy will describe the cookies KeeperHQ uses, including the session cookies required for login and any analytics cookies, and how to manage them.', 6);

insert into public.membership_packages (key, name, price_display, price_note, evaluation_note, features, featured, sort_order) values
('bronze', 'Bronze', '$12.99', '/month', 'No individual evaluation',
 '{"Full access to the KeeperHQ training library","All technical categories","Train anywhere, anytime"}', false, 1),
('silver', 'Silver', '$44.99', '/month', '1 individual evaluation per month',
 '{"All training videos","Up to 3 uploaded training clips","Written and verbal feedback","30-minute Zoom evaluation"}', true, 2),
('gold', 'Gold', '$59.99', '/month', '2 individual evaluations per month',
 '{"All training videos","Up to 3 uploaded clips per evaluation","Written and verbal feedback","30-minute Zoom evaluations","More consistent individual development"}', false, 3);

insert into public.sc_programs (key, title, focus, price_display, category, sort_order) values
('sc_explosive', 'Explosive GK', 'Reactive power, jumping, and diving explosiveness.', '$25–$40', 'program', 1),
('sc_fit', 'Fit GK', 'Conditioning, work capacity, and movement quality.', '$25–$40', 'program', 2),
('sc_strong', 'Strong GK', 'Foundational full-body strength.', '$25–$40', 'program', 3),
('sc_powerful', 'Powerful GK', 'Advanced power expression and speed-strength.', '$25–$40', 'program', 4),
('sc_bundle', 'All 4 GK Programs', 'The complete bundle.', '$75–$100', 'bundle', 5),
('sc_custom', 'Personalized / Custom Plan', 'An individualized plan based on your athlete intake, with ongoing check-ins.', '$75–$150 one-time or $40–$60/month', 'custom', 6);

insert into public.app_config (key, value) values
('site_text', '{
  "tagline": "Develop Your Game. Anywhere. Anytime.",
  "hero_description": "Online goalkeeper development combining structured technical training, individual feedback, game analysis, and physical performance development.",
  "cta": "Start today and take your goalkeeping game to the next level.",
  "contact_email": "info@keeperhq.com"
}'),
('social_links', '[]'),
('cal_usernames', '{"stefan": "", "jack": "", "paul": ""}')
on conflict (key) do nothing;

update public.app_config
set value = '{
  "summary": "Support hours to be confirmed — final KeeperHQ hours will be published here.",
  "timezone": "ET",
  "note": "Training library available 24/7. Live support, evaluations, and Zoom sessions run during scheduled availability."
}'
where key = 'operating_hours';
