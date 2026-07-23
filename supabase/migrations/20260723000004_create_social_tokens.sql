-- Provider-neutral OAuth token storage. Tokens are encrypted by the application
-- service before reaching this table; no provider-specific fields are stored.
create table public.social_tokens (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider text not null check (char_length(btrim(provider)) between 1 and 64),
  provider_user_id text not null check (char_length(btrim(provider_user_id)) > 0),
  access_token text not null,
  refresh_token text,
  token_type text not null default 'Bearer',
  expires_at timestamptz,
  scopes text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, provider, provider_user_id)
);

create index social_tokens_workspace_provider_idx
  on public.social_tokens (workspace_id, provider);
create index social_tokens_workspace_expires_at_idx
  on public.social_tokens (workspace_id, expires_at);

create trigger set_social_tokens_updated_at
before update on public.social_tokens
for each row execute function public.set_updated_at();

alter table public.social_tokens enable row level security;

create policy "Members can view social tokens"
on public.social_tokens
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can create social tokens"
on public.social_tokens
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create policy "Members can update social tokens"
on public.social_tokens
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can delete social tokens"
on public.social_tokens
for delete
to authenticated
using (public.is_workspace_member(workspace_id));
