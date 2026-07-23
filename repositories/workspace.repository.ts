import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Workspace } from "@/types/database";

export class WorkspaceRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(workspaceId: string): Promise<Workspace | null> {
    const { data, error } = await this.client
      .from("workspaces")
      .select()
      .eq("id", workspaceId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async listForUser(userId: string): Promise<Workspace[]> {
    const { data: memberships, error: membershipError } = await this.client
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId);

    if (membershipError) throw membershipError;
    if (memberships.length === 0) return [];

    const { data, error } = await this.client
      .from("workspaces")
      .select()
      .in(
        "id",
        memberships.map(({ workspace_id }) => workspace_id),
      )
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  async updateName(workspaceId: string, name: string): Promise<Workspace> {
    const { data, error } = await this.client
      .from("workspaces")
      .update({ name })
      .eq("id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
