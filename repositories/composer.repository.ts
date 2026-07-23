import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Media = Database["public"]["Tables"]["media"]["Row"];
type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export type DraftPage = {
  items: Post[];
  total: number;
};

export class ComposerRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async createDraft(input: Database["public"]["Tables"]["posts"]["Insert"]): Promise<Post> {
    const { data, error } = await this.client.from("posts").insert(input).select().single();

    if (error) throw error;
    return data;
  }

  async findDraft(draftId: string, workspaceId: string): Promise<Post | null> {
    const { data, error } = await this.client
      .from("posts")
      .select()
      .eq("id", draftId)
      .eq("workspace_id", workspaceId)
      .eq("status", "draft")
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateDraft(draftId: string, workspaceId: string, input: PostUpdate): Promise<Post> {
    const { data, error } = await this.client
      .from("posts")
      .update(input)
      .eq("id", draftId)
      .eq("workspace_id", workspaceId)
      .eq("status", "draft")
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDraft(draftId: string, workspaceId: string): Promise<void> {
    const { error } = await this.client
      .from("posts")
      .delete()
      .eq("id", draftId)
      .eq("workspace_id", workspaceId)
      .eq("status", "draft");

    if (error) throw error;
  }

  async listDrafts(
    workspaceId: string,
    { from, search, to }: { from: number; to: number; search?: string },
  ): Promise<DraftPage> {
    let query = this.client
      .from("posts")
      .select("*", { count: "exact" })
      .eq("workspace_id", workspaceId)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (search) {
      const term = search.replace(/[,.()]/g, " ");
      query = query.or(`title.ilike.%${term}%,caption.ilike.%${term}%`);
    }

    const { count, data, error } = await query;
    if (error) throw error;

    return { items: data, total: count ?? 0 };
  }

  async attachMedia(workspaceId: string, draftId: string, mediaId: string, sortOrder: number): Promise<void> {
    const { error } = await this.client.from("post_media").insert({
      workspace_id: workspaceId,
      post_id: draftId,
      media_id: mediaId,
      sort_order: sortOrder,
    });

    if (error) throw error;
  }

  async removeMedia(workspaceId: string, draftId: string, mediaId: string): Promise<void> {
    const { error } = await this.client
      .from("post_media")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("post_id", draftId)
      .eq("media_id", mediaId);

    if (error) throw error;
  }

  async listAttachedMedia(workspaceId: string, draftId: string): Promise<Media[]> {
    const { data: links, error: linkError } = await this.client
      .from("post_media")
      .select("media_id, sort_order")
      .eq("workspace_id", workspaceId)
      .eq("post_id", draftId)
      .order("sort_order", { ascending: true });

    if (linkError) throw linkError;
    if (links.length === 0) return [];

    const { data, error } = await this.client
      .from("media")
      .select()
      .eq("workspace_id", workspaceId)
      .in(
        "id",
        links.map(({ media_id }) => media_id),
      );

    if (error) throw error;

    const order = new Map(links.map(({ media_id, sort_order }) => [media_id, sort_order]));
    return data.sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
  }

  async selectSocialAccount(workspaceId: string, draftId: string, socialAccountId: string): Promise<void> {
    const { error } = await this.client.from("post_social_accounts").insert({
      workspace_id: workspaceId,
      post_id: draftId,
      social_account_id: socialAccountId,
    });

    if (error) throw error;
  }

  async removeSocialAccount(workspaceId: string, draftId: string, socialAccountId: string): Promise<void> {
    const { error } = await this.client
      .from("post_social_accounts")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("post_id", draftId)
      .eq("social_account_id", socialAccountId);

    if (error) throw error;
  }

  async listSelectedSocialAccounts(workspaceId: string, draftId: string): Promise<SocialAccount[]> {
    const { data: links, error: linkError } = await this.client
      .from("post_social_accounts")
      .select("social_account_id")
      .eq("workspace_id", workspaceId)
      .eq("post_id", draftId);

    if (linkError) throw linkError;
    if (links.length === 0) return [];

    const { data, error } = await this.client
      .from("social_accounts")
      .select()
      .eq("workspace_id", workspaceId)
      .in(
        "id",
        links.map(({ social_account_id }) => social_account_id),
      );

    if (error) throw error;
    return data;
  }
}
