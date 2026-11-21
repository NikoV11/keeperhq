-- profiles_update_own lets a member update their own row, but it can't restrict which
-- columns change — so a member could call the API with their own session and set
-- role = 'admin', or point stripe_customer_id at someone else's Stripe customer and
-- open that person's billing portal. Guard those two columns with a trigger:
--   role               → only an admin may change it (the /admin/members page)
--   stripe_customer_id → only server-side code using the service-role key
-- Trusted contexts (service_role, the SQL editor's postgres role, other
-- security-definer functions) are not affected.

create function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    raise exception 'Only an admin can change a role' using errcode = '42501';
  end if;

  if new.stripe_customer_id is distinct from old.stripe_customer_id then
    raise exception 'stripe_customer_id is managed by the server' using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger protect_profile_privileged_columns
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

-- A member must not be able to create their own profile row with elevated values
-- either (handle_new_user creates it as a security-definer function, so this policy
-- is never needed by the app).
drop policy if exists "profiles_insert_own" on public.profiles;
