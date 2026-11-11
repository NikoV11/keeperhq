-- Single private bucket for all media (training videos, member clips, CVs, photos),
-- organized by path prefix: training/, clips/{user_id}/, cv/, photos/, feedback/.
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

-- Members can upload/read/delete only inside their own clips/{auth.uid()}/ prefix.
create policy "media_member_own_clips_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'clips'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "media_member_own_clips_select"
  on storage.objects for select
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'clips'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "media_member_own_clips_delete"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'clips'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- Coaches/admins can read everything in the bucket (clips, training videos, CVs, etc.)
-- and write to the shared prefixes (training/, cv/, photos/, feedback/).
create policy "media_staff_select_all"
  on storage.objects for select
  using (bucket_id = 'media' and public.is_coach_or_admin(auth.uid()));

create policy "media_staff_write_shared"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and public.is_coach_or_admin(auth.uid())
    and (storage.foldername(name))[1] in ('training', 'cv', 'photos', 'feedback')
  );

-- Any authenticated member can read published training videos and public team assets.
create policy "media_authenticated_select_training"
  on storage.objects for select
  using (
    bucket_id = 'media'
    and auth.uid() is not null
    and (storage.foldername(name))[1] in ('training', 'cv', 'photos')
  );
