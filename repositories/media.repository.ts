import type { SupabaseClient } from "@supabase/supabase-js";
import { MARKETFLOW_MEDIA_BUCKET } from "@/lib/validation/media.validation";
import type { Database } from "@/types/database";

type Media = Database["public"]["Tables"]["media"]["Row"];
type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];

export type MediaPage = {
  items: Media[];
  total: number;
};

export class MediaRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async uploadFile(storagePath: string, file: File): Promise<void> {
    const { error } = await this.client.storage.from(MARKETFLOW_MEDIA_BUCKET).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw error;
  }

  async deleteFile(storagePath: string): Promise<void> {
    const { error } = await this.client.storage.from(MARKETFLOW_MEDIA_BUCKET).remove([storagePath]);

    if (error) throw error;
  }

  getPublicPreviewUrl(storagePath: string): string {
    return this.client.storage.from(MARKETFLOW_MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl;
  }

  async create(input: MediaInsert): Promise<Media> {
    const { data, error } = await this.client.from("media").insert(input).select().single();

    if (error) throw error;
    return data;
  }

  async findById(mediaId: string, workspaceId: string): Promise<Media | null> {
    const { data, error } = await this.client
      .from("media")
      .select()
      .eq("id", mediaId)
      .eq("workspace_id", workspaceId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async listByWorkspace(
    workspaceId: string,
    { from, search, to }: { from: number; to: number; search?: string },
  ): Promise<MediaPage> {
    let query = this.client
      .from("media")
      .select("*", { count: "exact" })
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) query = query.ilike("file_name", `%${search}%`);

    const { count, data, error } = await query;
    if (error) throw error;

    return { items: data, total: count ?? 0 };
  }

  async deleteById(mediaId: string, workspaceId: string): Promise<void> {
    const { error } = await this.client
      .from("media")
      .delete()
      .eq("id", mediaId)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
  }
}
