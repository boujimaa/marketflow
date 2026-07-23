import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SocialAccount } from "@/types/database";

type SocialAccountInsert = Database["public"]["Tables"]["social_accounts"]["Insert"];

export class SocialAccountRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async create(input: SocialAccountInsert): Promise<SocialAccount> {
    const { data, error } = await this.client.from("social_accounts").insert(input).select().single();

    if (error) throw error;
    return data;
  }

  async listByWorkspace(workspaceId: string): Promise<SocialAccount[]> {
    const { data, error } = await this.client
      .from("social_accounts")
      .select()
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateStatus(id: string, workspaceId: string, status: string): Promise<SocialAccount> {
    const { data, error } = await this.client
      .from("social_accounts")
      .update({ status })
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
