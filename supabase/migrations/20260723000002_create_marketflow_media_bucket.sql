-- Public previews are served from this bucket. Object creation, listing, and
-- deletion remain limited to members of the workspace encoded in the path.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'marketflow-media',
  'marketflow-media',
  true,
  2147483648,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Workspace members can upload media objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'marketflow-media'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
  and public.is_workspace_member((storage.foldername(name))[1]::uuid)
);

create policy "Workspace members can list media objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'marketflow-media'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
  and public.is_workspace_member((storage.foldername(name))[1]::uuid)
);

create policy "Workspace members can delete media objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'marketflow-media'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
  and public.is_workspace_member((storage.foldername(name))[1]::uuid)
);

create policy "Members can create media metadata"
on public.media
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create policy "Members can delete media metadata"
on public.media
for delete
to authenticated
using (public.is_workspace_member(workspace_id));
