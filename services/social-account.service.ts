import { getProviderAccountsSchema } from "@/lib/validation/social-auth.validation";
import { SocialTokenRepository } from "@/repositories/social-token.repository";

export class SocialAccountService {
  constructor(private readonly tokens: SocialTokenRepository) {}

  async getProviderAccounts(input: unknown) {
    const { provider, workspaceId } = getProviderAccountsSchema.parse(input);
    const connections = await this.tokens.listByWorkspace(workspaceId, provider);

    return connections.map((connection) => ({
      id: connection.id,
      provider: connection.provider,
      providerUserId: connection.provider_user_id,
      expiresAt: connection.expires_at,
      scopes: connection.scopes,
      metadata: connection.metadata,
      createdAt: connection.created_at,
      updatedAt: connection.updated_at,
    }));
  }
}
