-- MarketFlow multi-tenant workspace foundation.
-- This migration is intended to be run by the Supabase migration runner.

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, user_id)
);

create index workspaces_owner_user_id_idx on public.workspaces (owner_user_id);
create index workspace_members_workspace_id_idx on public.workspace_members (workspace_id);
create index workspace_members_user_id_idx on public.workspace_members (user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

create trigger set_workspace_members_updated_at
before update on public.workspace_members
for each row execute function public.set_updated_at();

-- These functions run as the table owner so the policies below do not recurse
-- while checking membership. auth.uid() still comes from the requesting session.
create function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members as membership
    where membership.workspace_id = target_workspace_id
      and membership.user_id = auth.uid()
  );
$$;

create function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members as membership
    where membership.workspace_id = target_workspace_id
      and membership.user_id = auth.uid()
      and membership.role = 'owner'
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_owner(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- A user can read every workspace they belong to, but only its owner can change it.
create policy "Members can view their workspaces"
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

create policy "Owners can update their workspaces"
on public.workspaces
for update
to authenticated
using (public.is_workspace_owner(id))
with check (owner_user_id = auth.uid());

-- Members can see fellow members in a workspace they belong to. Membership changes
-- are intentionally server-managed until workspace administration is implemented.
create policy "Members can view workspace members"
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id));

create function public.handle_new_user_workspace()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  personal_workspace_id uuid;
  personal_workspace_name text;
begin
  personal_workspace_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(new.email, '@', 1), ''),
    'My'
  ) || '''s workspace';

  insert into public.workspaces (owner_user_id, name)
  values (new.id, personal_workspace_name)
  returning id into personal_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (personal_workspace_id, new.id, 'owner');

  return new;
end;
$$;

create trigger create_personal_workspace_for_new_user
after insert on auth.users
for each row execute function public.handle_new_user_workspace();
