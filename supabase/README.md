# MarketFlow database

This directory contains Supabase migrations for the MarketFlow multi-tenant workspace and core content architecture. Apply the migrations with the Supabase CLI or your normal Supabase deployment workflow; do not run the SQL through the browser client.

## Schema

`workspaces` is the tenant boundary. Each workspace has a UUID primary key, an `owner_user_id` pointing to `auth.users`, a display name, and UTC `created_at`/`updated_at` timestamps.

`workspace_members` maps Supabase Auth users to workspaces. It has its own UUID primary key, unique `(workspace_id, user_id)` membership, and one of three roles: `owner`, `admin`, or `member`. The only membership currently created automatically is the `owner` membership for a personal workspace.

Both tables have the foreign-key indexes needed for common owner, workspace, and user lookups. Deleting a workspace removes its memberships; deleting a user removes their memberships. A workspace owner cannot be deleted while their workspace remains, protecting the tenant record from becoming orphaned.

The core migration adds these workspace-scoped tables:

- `social_accounts` stores Facebook or Instagram account credentials and connection status.
- `facebook_pages` and `instagram_accounts` store connected provider resources.
- `media` stores metadata for workspace-owned storage objects.
- `posts` and `post_versions` store post drafts and their caption history.
- `scheduled_posts` stores a post's intended time and timezone, without scheduling behavior.
- `publish_logs` stores provider responses, without publishing behavior.

Every new table contains `workspace_id`, UUID primary keys, and UTC `created_at`/`updated_at` timestamps. Child tables use composite foreign keys containing both their parent ID and `workspace_id`; this makes cross-workspace relationships impossible at the database level. The migration also indexes every foreign key and the normal workspace/status/time lookup paths.

## User provisioning

The `create_personal_workspace_for_new_user` trigger runs after each insert into `auth.users`. It creates a personal workspace named from `raw_user_meta_data.full_name`, then the email prefix, or `My`, and creates the user's `owner` membership in the same transaction.

## Row Level Security

RLS is enabled on every application table in both migrations.

- Authenticated users can read only workspaces they are members of.
- Authenticated users can read membership records only for workspaces they belong to.
- Only an `owner` can update their workspace, and ownership must remain with that authenticated user.
- Authenticated users can read core records only when their workspace membership matches the record's `workspace_id`.
- Client-side creation or mutation of memberships is deliberately not enabled yet; those operations remain server-managed until workspace administration is introduced.

Core record writes are also server-managed at this stage. No client write policy is present, so RLS denies direct inserts, updates, and deletes by default.

The membership-check functions are `SECURITY DEFINER` functions used only to prevent recursive RLS checks. They still evaluate `auth.uid()` from the requesting user's JWT and are executable only by the `authenticated` role.

The database provides storage for posts, intended scheduled times, and publish outcomes only. It does not include publishing or scheduling logic, jobs, or triggers.
