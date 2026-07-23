import type { MetaFacebookPage } from "@/providers/meta/pages";
import { FacebookPageRepository } from "@/repositories/facebook-page.repository";
import { SocialAuthService } from "./social-auth.service";

export class FacebookPageService {
  constructor(
    private readonly pages: FacebookPageRepository,
    private readonly socialAuth: SocialAuthService,
  ) {}

  async storePages(input: {
    workspaceId: string;
    socialTokenId: string;
    pages: MetaFacebookPage[];
  }) {
    return Promise.all(
      input.pages.map((page) =>
        this.pages.upsert({
          workspace_id: input.workspaceId,
          social_token_id: input.socialTokenId,
          page_id: page.id,
          page_name: page.name,
          page_access_token: this.socialAuth.encryptToken(page.accessToken),
          profile_picture_url: page.profilePictureUrl,
          connected: true,
          status: "connected",
        }),
      ),
    );
  }

  async getWorkspacePages(workspaceId: string) {
    const pages = await this.pages.listByWorkspace(workspaceId);

    return pages.map(
      ({
        connected,
        created_at,
        id,
        page_id,
        page_name,
        profile_picture_url,
        social_token_id,
        status,
        updated_at,
        workspace_id,
      }) => ({
        connected,
        created_at,
        id,
        page_id,
        page_name,
        profile_picture_url,
        social_token_id,
        status,
        updated_at,
        workspace_id,
      }),
    );
  }
}
