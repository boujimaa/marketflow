-- Meta resource records are workspace-scoped. Their access-token columns store
-- AES-GCM ciphertext produced by SocialAuthService, never plaintext tokens.
alter table public.social_tokens
add constraint social_tokens_id_workspace_id_key unique (id, workspace_id);

alter table public.facebook_pages
alter column social_account_id drop not null,
add column social_token_id uuid,
add column profile_picture_url text,
add column status text not null default 'connected'
  check (status in ('connected', 'disconnected', 'error')),
add foreign key (social_token_id, workspace_id)
  references public.social_tokens (id, workspace_id) on delete cascade;

alter table public.instagram_accounts
add column profile_picture_url text,
add column status text not null default 'connected'
  check (status in ('connected', 'disconnected', 'error'));

create index facebook_pages_workspace_social_token_idx
  on public.facebook_pages (workspace_id, social_token_id);
create index instagram_accounts_workspace_status_idx
  on public.instagram_accounts (workspace_id, status);

create policy "Members can create Facebook pages"
on public.facebook_pages
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create policy "Members can update Facebook pages"
on public.facebook_pages
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can delete Facebook pages"
on public.facebook_pages
for delete
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "Members can create Instagram accounts"
on public.instagram_accounts
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

create policy "Members can update Instagram accounts"
on public.instagram_accounts
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "Members can delete Instagram accounts"
on public.instagram_accounts
for delete
to authenticated
using (public.is_workspace_member(workspace_id));
