import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { FacebookLongLivedToken } from "@/lib/meta/oauth";

export type StoreFacebookConnectionInput = {
  userId: string;
  token: FacebookLongLivedToken;
};

/**
 * Stores Facebook OAuth credentials with a server-only Supabase client.
 * The access token never crosses into browser-rendered components.
 */
export async function storeFacebookConnection({
  token,
  userId,
}: StoreFacebookConnectionInput) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("meta_oauth_connections").upsert(
    {
      user_id: userId,
      provider: "facebook",
      access_token: token.accessToken,
      token_type: token.tokenType,
      expires_at: token.expiresAt,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,provider",
    },
  );

  if (error) {
    throw new Error(`Failed to store Facebook connection: ${error.message}`);
  }
}
