-- Enforce "up to 3 uploaded clips per evaluation cycle" at the database layer.
-- A clip counts against the cap while it's unlinked (evaluation_id is null, i.e. not
-- yet bundled into a coach evaluation). Once a coach creates the evaluation and links
-- the pending clips, the member's pending count drops back to 0 for the next cycle.

create function public.check_clip_upload_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pending_count integer;
begin
  select count(*) into pending_count
  from public.uploaded_clips
  where user_id = new.user_id and evaluation_id is null;

  if pending_count >= 3 then
    raise exception 'Clip upload limit reached for this evaluation cycle (max 3 pending clips).';
  end if;

  return new;
end;
$$;

create trigger enforce_clip_upload_limit
  before insert on public.uploaded_clips
  for each row execute function public.check_clip_upload_limit();
