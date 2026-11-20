-- Newer Supabase projects no longer grant table privileges to the API roles automatically,
-- so every query from the site failed with "permission denied" (42501) — including the
-- admin role check, which then bounced admins to /dashboard.
--
-- These grants only open the door; row level security (enabled on every table in
-- 0001–0005) still decides which rows each person can read or change. Tables with no
-- policy for a role, such as stripe_events, stay inaccessible to it.

grant usage on schema public to anon, authenticated, service_role;

-- Server-only key (Stripe webhook, admin client). It bypasses RLS but still needs grants.
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant execute on functions to service_role;

grant select on all tables in schema public to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

-- The contact form posts as a logged-out visitor (policy contact_messages_insert_anyone).
grant insert on public.contact_messages to anon;
grant usage, select on all sequences in schema public to anon, authenticated;

-- RLS policies call these helpers as the requesting role.
grant execute on all functions in schema public to anon, authenticated;

-- Cover tables added by future migrations too.
alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
alter default privileges in schema public
  grant execute on functions to anon, authenticated;
