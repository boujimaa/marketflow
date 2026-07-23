-- MarketFlow core content architecture.
-- Every record is scoped to a workspace, including child records whose parent
-- already belongs to the same workspace. Composite keys enforce that boundary.

create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider text not null check (provider in ('facebook', 'instagram')),
  provider_user_id text not null,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked', 'error')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, provider, provider_user_id),
  unique (id, workspace_id)
);

create table public.facebook_pages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  social_account_id uuid not null,
  page_id text not null,
  page_name text not null,
  page_access_token text not null,
  connected boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, page_id),
  unique (id, workspace_id),
  foreign key (social_account_id, workspace_id)
    references public.social_accounts (id, workspace_id) on delete cascade
);

create table public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  facebook_page_id uuid not null,
  instagram_id text not null,
  username text not null,
  connected boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, instagram_id),
  foreign key (facebook_page_id, workspace_id)
    references public.facebook_pages (id, workspace_id) on delete cascade
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  file_name text not null check (char_length(btrim(file_name)) > 0),
  file_type text not null check (char_length(btrim(file_type)) > 0),
  storage_path text not null check (char_length(btrim(storage_path)) > 0),
  size bigint not null check (size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, storage_path)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  title text not null check (char_length(btrim(title)) > 0),
  caption text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, workspace_id)
);

create table public.post_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  post_id uuid not null,
  caption text,
  version_number integer not null check (version_number > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (post_id, version_number),
  foreign key (post_id, workspace_id)
    references public.posts (id, workspace_id) on delete cascade
);

create table public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  post_id uuid not null,
  scheduled_for timestamptz not null,
  timezone text not null check (char_length(btrim(timezone)) > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (post_id),
  foreign key (post_id, workspace_id)
    references public.posts (id, workspace_id) on delete cascade
);

create table public.publish_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  post_id uuid not null,
  provider text not null check (provider in ('facebook', 'instagram')),
  status text not null check (status in ('pending', 'success', 'failed')),
  response jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  foreign key (post_id, workspace_id)
    references public.posts (id, workspace_id) on delete cascade
);

create index social_accounts_workspace_status_idx
  on public.social_accounts (workspace_id, status);
create index facebook_pages_workspace_id_idx on public.facebook_pages (workspace_id);
create index facebook_pages_social_account_id_idx on public.facebook_pages (social_account_id);
create index instagram_accounts_workspace_id_idx on public.instagram_accounts (workspace_id);
create index instagram_accounts_facebook_page_id_idx on public.instagram_accounts (facebook_page_id);
create index media_workspace_created_at_idx on public.media (workspace_id, created_at desc);
create index posts_workspace_status_updated_at_idx on public.posts (workspace_id, status, updated_at desc);
create index post_versions_workspace_post_id_idx on public.post_versions (workspace_id, post_id);
create index scheduled_posts_workspace_scheduled_for_idx
  on public.scheduled_posts (workspace_id, scheduled_for);
create index publish_logs_workspace_post_created_at_idx
  on public.publish_logs (workspace_id, post_id, created_at desc);

create trigger set_social_accounts_updated_at
before update on public.social_accounts
for each row execute function public.set_updated_at();

create trigger set_facebook_pages_updated_at
before update on public.facebook_pages
for each row execute function public.set_updated_at();

create trigger set_instagram_accounts_updated_at
before update on public.instagram_accounts
for each row execute function public.set_updated_at();

create trigger set_media_updated_at
before update on public.media
for each row execute function public.set_updated_at();

create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create trigger set_post_versions_updated_at
before update on public.post_versions
for each row execute function public.set_updated_at();

create trigger set_scheduled_posts_updated_at
before update on public.scheduled_posts
for each row execute function public.set_updated_at();

create trigger set_publish_logs_updated_at
before update on public.publish_logs
for each row execute function public.set_updated_at();

alter table public.social_accounts enable row level security;
alter table public.facebook_pages enable row level security;
alter table public.instagram_accounts enable row level security;
alter table public.media enable row level security;
alter table public.posts enable row level security;
alter table public.post_versions enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.publish_logs enable row level security;

-- Application writes are server-managed. Authenticated workspace members can
-- only read rows scoped to one of their own workspaces.
create policy "Members can view social accounts"
on public.social_accounts for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view Facebook pages"
on public.facebook_pages for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view Instagram accounts"
on public.instagram_accounts for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view media"
on public.media for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view posts"
on public.posts for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view post versions"
on public.post_versions for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view scheduled posts"
on public.scheduled_posts for select to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can view publish logs"
on public.publish_logs for select to authenticated
using (public.is_workspace_member(workspace_id));
