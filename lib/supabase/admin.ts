import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "./env";

function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY for server-only token storage.",
    );
  }

  return serviceRoleKey;
}

/**
 * Creates a privileged Supabase client for server-only writes.
 * Never import this client from Client Components.
 */
export function createSupabaseAdminClient() {
  const { url } = getSupabaseEnvironment();

  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
