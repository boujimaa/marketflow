# MarketFlow database

This directory contains Supabase migrations for the MarketFlow multi-tenant workspace foundation. Apply the migrations with the Supabase CLI or your normal Supabase deployment workflow; do not run the SQL through the browser client.

## Schema

`workspaces` is the tenant boundary. Each workspace has a UUID primary key, an `owner_user_id` pointing to `auth.users`, a display name, and UTC `created_at`/`updated_at` timestamps.

`workspace_members` maps Supabase Auth users to workspaces. It has its own UUID primary key, unique `(workspace_id, user_id)` membership, and one of three roles: `owner`, `admin`, or `member`. The only membership currently created automatically is the `owner` membership for a personal workspace.

Both tables have the foreign-key indexes needed for common owner, workspace, and user lookups. Deleting a workspace removes its memberships; deleting a user removes their memberships. A workspace owner cannot be deleted while their workspace remains, protecting the tenant record from becoming orphaned.

## User provisioning

The `create_personal_workspace_for_new_user` trigger runs after each insert into `auth.users`. It creates a personal workspace named from `raw_user_meta_data.full_name`, then the email prefix, or `My`, and creates the user's `owner` membership in the same transaction.

## Row Level Security

RLS is enabled on every application table in this migration.

- Authenticated users can read only workspaces they are members of.
- Authenticated users can read membership records only for workspaces they belong to.
- Only an `owner` can update their workspace, and ownership must remain with that authenticated user.
- Client-side creation or mutation of memberships is deliberately not enabled yet; those operations remain server-managed until workspace administration is introduced.

The membership-check functions are `SECURITY DEFINER` functions used only to prevent recursive RLS checks. They still evaluate `auth.uid()` from the requesting user's JWT and are executable only by the `authenticated` role.

No posts, pages, media, publishing, or scheduling tables are included.
