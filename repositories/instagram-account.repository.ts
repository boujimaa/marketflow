import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type InstagramAccount = Database["public"]["Tables"]["instagram_accounts"]["Row"];
type InstagramAccountInsert = Database["public"]["Tables"]["instagram_accounts"]["Insert"];

export class InstagramAccountRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async upsert(input: InstagramAccountInsert): Promise<InstagramAccount> {
    const { data, error } = await this.client
      .from("instagram_accounts")
      .upsert(input, { onConflict: "workspace_id,instagram_id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
