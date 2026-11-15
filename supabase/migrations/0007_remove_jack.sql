-- Jack is no longer part of KeeperHQ.
--
-- Migration 0005 no longer creates him, so a fresh database never has this row.
-- This migration exists for a database where 0005 already ran; it is a safe no-op
-- otherwise, so it can be applied either way.

delete from public.team_members where slug = 'jack';

-- Keep Paul directly after Stefan in the team ordering.
update public.team_members set sort_order = 2 where slug = 'paul';

-- Drop his booking username from the site config.
update public.app_config
set value = value - 'jack',
    updated_at = now()
where key = 'cal_usernames';
