import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type FacebookPage = Database["public"]["Tables"]["facebook_pages"]["Row"];
type FacebookPageInsert = Database["public"]["Tables"]["facebook_pages"]["Insert"];

export class FacebookPageRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async upsert(input: FacebookPageInsert): Promise<FacebookPage> {
    const { data, error } = await this.client
      .from("facebook_pages")
      .upsert(input, { onConflict: "workspace_id,page_id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async listByWorkspace(workspaceId: string): Promise<FacebookPage[]> {
    const { data, error } = await this.client
      .from("facebook_pages")
      .select()
      .eq("workspace_id", workspaceId)
      .order("page_name");
    if (error) throw error;
    return data;
  }
}
