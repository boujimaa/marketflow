// Generated from the linked Supabase project with:
// npx supabase gen types typescript --linked

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      workspaces: Table<
        { id: string; owner_user_id: string; name: string; created_at: string; updated_at: string },
        { id?: string; owner_user_id: string; name: string; created_at?: string; updated_at?: string },
        { id?: string; owner_user_id?: string; name?: string; created_at?: string; updated_at?: string }
      >;
      workspace_members: Table<
        { id: string; workspace_id: string; user_id: string; role: string; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; user_id: string; role?: string; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; user_id?: string; role?: string; created_at?: string; updated_at?: string }
      >;
      social_accounts: Table<
        { id: string; workspace_id: string; provider: string; provider_user_id: string; access_token: string; refresh_token: string | null; token_expires_at: string | null; status: string; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; provider: string; provider_user_id: string; access_token: string; refresh_token?: string | null; token_expires_at?: string | null; status?: string; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; provider?: string; provider_user_id?: string; access_token?: string; refresh_token?: string | null; token_expires_at?: string | null; status?: string; created_at?: string; updated_at?: string }
      >;
      social_tokens: Table<
        { id: string; workspace_id: string; provider: string; provider_user_id: string; access_token: string; refresh_token: string | null; token_type: string; expires_at: string | null; scopes: string[]; metadata: Json; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; provider: string; provider_user_id: string; access_token: string; refresh_token?: string | null; token_type?: string; expires_at?: string | null; scopes?: string[]; metadata?: Json; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; provider?: string; provider_user_id?: string; access_token?: string; refresh_token?: string | null; token_type?: string; expires_at?: string | null; scopes?: string[]; metadata?: Json; created_at?: string; updated_at?: string }
      >;
      facebook_pages: Table<
        { id: string; workspace_id: string; social_account_id: string; page_id: string; page_name: string; page_access_token: string; connected: boolean; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; social_account_id: string; page_id: string; page_name: string; page_access_token: string; connected?: boolean; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; social_account_id?: string; page_id?: string; page_name?: string; page_access_token?: string; connected?: boolean; created_at?: string; updated_at?: string }
      >;
      instagram_accounts: Table<
        { id: string; workspace_id: string; facebook_page_id: string; instagram_id: string; username: string; connected: boolean; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; facebook_page_id: string; instagram_id: string; username: string; connected?: boolean; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; facebook_page_id?: string; instagram_id?: string; username?: string; connected?: boolean; created_at?: string; updated_at?: string }
      >;
      media: Table<
        { id: string; workspace_id: string; file_name: string; file_type: string; storage_path: string; size: number; width: number | null; height: number | null; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; file_name: string; file_type: string; storage_path: string; size: number; width?: number | null; height?: number | null; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; file_name?: string; file_type?: string; storage_path?: string; size?: number; width?: number | null; height?: number | null; created_at?: string; updated_at?: string }
      >;
      posts: Table<
        { id: string; workspace_id: string; title: string; caption: string | null; status: string; publishing_options: Json; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; title: string; caption?: string | null; status?: string; publishing_options?: Json; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; title?: string; caption?: string | null; status?: string; publishing_options?: Json; created_at?: string; updated_at?: string }
      >;
      post_media: Table<
        { id: string; workspace_id: string; post_id: string; media_id: string; sort_order: number; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; post_id: string; media_id: string; sort_order?: number; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; post_id?: string; media_id?: string; sort_order?: number; created_at?: string; updated_at?: string }
      >;
      post_social_accounts: Table<
        { id: string; workspace_id: string; post_id: string; social_account_id: string; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; post_id: string; social_account_id: string; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; post_id?: string; social_account_id?: string; created_at?: string; updated_at?: string }
      >;
      post_versions: Table<
        { id: string; workspace_id: string; post_id: string; caption: string | null; version_number: number; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; post_id: string; caption?: string | null; version_number: number; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; post_id?: string; caption?: string | null; version_number?: number; created_at?: string; updated_at?: string }
      >;
      scheduled_posts: Table<
        { id: string; workspace_id: string; post_id: string; scheduled_for: string; timezone: string; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; post_id: string; scheduled_for: string; timezone: string; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; post_id?: string; scheduled_for?: string; timezone?: string; created_at?: string; updated_at?: string }
      >;
      publish_logs: Table<
        { id: string; workspace_id: string; post_id: string; provider: string; status: string; response: Json | null; created_at: string; updated_at: string },
        { id?: string; workspace_id: string; post_id: string; provider: string; status: string; response?: Json | null; created_at?: string; updated_at?: string },
        { id?: string; workspace_id?: string; post_id?: string; provider?: string; status?: string; response?: Json | null; created_at?: string; updated_at?: string }
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_workspace_member: { Args: { target_workspace_id: string }; Returns: boolean };
      is_workspace_owner: { Args: { target_workspace_id: string }; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
