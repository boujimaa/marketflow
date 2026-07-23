import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Post } from "@/types/database";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
type PostVersionInsert = Database["public"]["Tables"]["post_versions"]["Insert"];

export class PostRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async create(input: PostInsert): Promise<Post> {
    const { data, error } = await this.client.from("posts").insert(input).select().single();

    if (error) throw error;
    return data;
  }

  async findById(id: string, workspaceId: string): Promise<Post | null> {
    const { data, error } = await this.client
      .from("posts")
      .select()
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async listByWorkspace(workspaceId: string): Promise<Post[]> {
    const { data, error } = await this.client
      .from("posts")
      .select()
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async update(id: string, workspaceId: string, input: PostUpdate): Promise<Post> {
    const { data, error } = await this.client
      .from("posts")
      .update(input)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findLatestVersion(postId: string, workspaceId: string) {
    const { data, error } = await this.client
      .from("post_versions")
      .select()
      .eq("post_id", postId)
      .eq("workspace_id", workspaceId)
      .order("version_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createVersion(input: PostVersionInsert) {
    const { data, error } = await this.client.from("post_versions").insert(input).select().single();

    if (error) throw error;
    return data;
  }
}
