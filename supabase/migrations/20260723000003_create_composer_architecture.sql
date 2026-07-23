-- Composer data model. This records draft composition only; it does not queue,
-- schedule, or publish posts.
alter table public.posts
add column publishing_options jsonb not null default '{}'::jsonb
check (jsonb_typeof(publishing_options) = 'object');

alter table public.media
add constraint media_id_workspace_id_key unique (id, workspace_id);

create table public.post_media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  post_id uuid not null,
  media_id uuid not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (post_id, media_id),
  foreign key (post_id, workspace_id)
    references public.posts (id, workspace_id) on delete cascade,
  foreign key (media_id, workspace_id)
    references public.media (id, workspace_id) on delete cascade
);

create table public.post_social_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  post_id uuid not null,
  social_account_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (post_id, social_account_id),
  foreign key (post_id, workspace_id)
    references public.posts (id, workspace_id) on delete cascade,
  foreign key (social_account_id, workspace_id)
    references public.social_accounts (id, workspace_id) on delete cascade
);

create index post_media_workspace_post_sort_idx
  on public.post_media (workspace_id, post_id, sort_order);
create index post_media_media_id_idx on public.post_media (media_id);
create index post_social_accounts_workspace_post_idx
  on public.post_social_accounts (workspace_id, post_id);
create index post_social_accounts_social_account_id_idx
  on public.post_social_accounts (social_account_id);

create trigger set_post_media_updated_at
before update on public.post_media
for each row execute function public.set_updated_at();

create trigger set_post_social_accounts_updated_at
before update on public.post_social_accounts
for each row execute function public.set_updated_at();

alter table public.post_media enable row level security;
alter table public.post_social_accounts enable row level security;

create policy "Members can create draft posts"
on public.posts
for insert
to authenticated
with check (public.is_workspace_member(workspace_id) and status = 'draft');

create policy "Members can update draft posts"
on public.posts
for update
to authenticated
using (public.is_workspace_member(workspace_id) and status = 'draft')
with check (public.is_workspace_member(workspace_id) and status = 'draft');

create policy "Members can delete draft posts"
on public.posts
for delete
to authenticated
using (public.is_workspace_member(workspace_id) and status = 'draft');

create policy "Members can view post media"
on public.post_media
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can attach post media"
on public.post_media
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create policy "Members can remove post media"
on public.post_media
for delete
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view post social accounts"
on public.post_social_accounts
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can select post social accounts"
on public.post_social_accounts
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create policy "Members can remove post social accounts"
on public.post_social_accounts
for delete
to authenticated
using (public.is_workspace_member(workspace_id));
