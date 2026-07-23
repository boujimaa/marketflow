import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type SocialToken = Database["public"]["Tables"]["social_tokens"]["Row"];
type SocialTokenInsert = Database["public"]["Tables"]["social_tokens"]["Insert"];

export class SocialTokenRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async upsert(input: SocialTokenInsert): Promise<SocialToken> {
    const { data, error } = await this.client
      .from("social_tokens")
      .upsert(input, { onConflict: "workspace_id,provider,provider_user_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findById(tokenId: string, workspaceId: string): Promise<SocialToken | null> {
    const { data, error } = await this.client
      .from("social_tokens")
      .select()
      .eq("id", tokenId)
      .eq("workspace_id", workspaceId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async listByWorkspace(workspaceId: string, provider?: string): Promise<SocialToken[]> {
    let query = this.client
      .from("social_tokens")
      .select()
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (provider) query = query.eq("provider", provider);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateTokens(tokenId: string, workspaceId: string, input: SocialTokenInsert): Promise<SocialToken> {
    const { data, error } = await this.client
      .from("social_tokens")
      .update(input)
      .eq("id", tokenId)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(tokenId: string, workspaceId: string): Promise<void> {
    const { error } = await this.client
      .from("social_tokens")
      .delete()
      .eq("id", tokenId)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
  }
}
