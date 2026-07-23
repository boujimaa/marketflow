import { getMetaOAuthConfig } from "@/lib/meta/config";
import { MetaGraphApi, MetaGraphApiError } from "@/providers/meta/graph-api";
import { getInstagramBusinessAccount } from "@/providers/meta/instagram";
import {
  createMetaAuthorizationUrl,
  exchangeForLongLivedMetaToken,
  exchangeMetaAuthorizationCode,
} from "@/providers/meta/oauth";
import { getFacebookPages } from "@/providers/meta/pages";
import { validateGrantedPermissions, type MetaPermission } from "@/providers/meta/permissions";
import { FacebookPageService } from "./facebook-page.service";
import { InstagramAccountService } from "./instagram-account.service";
import { SocialAuthService } from "./social-auth.service";

type MetaUserResponse = {
  id?: string;
  name?: string;
  picture?: { data?: { url?: string } };
};

type MetaPermissionsResponse = { data?: MetaPermission[] };

export class MetaOAuthService {
  constructor(
    private readonly socialAuth: SocialAuthService,
    private readonly facebookPages: FacebookPageService,
    private readonly instagramAccounts: InstagramAccountService,
  ) {}

  createAuthorizationUrl(state: string): URL {
    return createMetaAuthorizationUrl(state);
  }

  async completeConnection(input: { workspaceId: string; code: string }) {
    try {
      const shortLived = await exchangeMetaAuthorizationCode(input.code);
      const token = await exchangeForLongLivedMetaToken(shortLived.accessToken);
      const graph = new MetaGraphApi(token.accessToken);
      const [user, permissions, discoveredPages] = await Promise.all([
        graph.get<MetaUserResponse>("/me", { fields: "id,name,picture{url}" }),
        graph.get<MetaPermissionsResponse>("/me/permissions"),
        getFacebookPages(graph),
      ]);

      if (!user.id) throw new Error("Meta did not return a Facebook user ID.");

      const scopes = validateGrantedPermissions(permissions.data ?? []);
      const connection = await this.socialAuth.connectProvider({
        workspaceId: input.workspaceId,
        provider: "meta",
        providerUserId: user.id,
        accessToken: token.accessToken,
        tokenType: token.tokenType,
        expiresAt: token.expiresAt,
        scopes,
        metadata: {
          displayName: user.name ?? null,
          profilePictureUrl: user.picture?.data?.url ?? null,
        },
      });
      const storedPages = await this.facebookPages.storePages({
        workspaceId: input.workspaceId,
        socialTokenId: connection.id,
        pages: discoveredPages,
      });

      const instagramAccounts = await Promise.all(
        storedPages.map(async (page) => {
          const account = await getInstagramBusinessAccount(graph, page.page_id);
          return account
            ? this.instagramAccounts.storeBusinessAccount({
                workspaceId: input.workspaceId,
                facebookPageId: page.id,
                account,
              })
            : null;
        }),
      );

      return {
        connection,
        facebookPages: storedPages.length,
        instagramAccounts: instagramAccounts.filter(Boolean).length,
      };
    } catch (error) {
      if (error instanceof MetaGraphApiError && error.isAuthorizationError) {
        throw new Error("Meta access was revoked or the access token expired.");
      }
      throw error;
    }
  }

  getRequiredConfiguration() {
    const config = getMetaOAuthConfig();
    return { redirectUri: config.redirectUri, graphApiVersion: config.graphApiVersion };
  }
}
