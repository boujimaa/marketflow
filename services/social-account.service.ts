import {
  createSocialAccountSchema,
  updateSocialAccountStatusSchema,
} from "@/lib/validation/social-account";
import { workspaceIdSchema } from "@/lib/validation/workspace";
import { SocialAccountRepository } from "@/repositories/social-account.repository";

export class SocialAccountService {
  constructor(private readonly socialAccounts: SocialAccountRepository) {}

  async createSocialAccount(input: unknown) {
    const account = createSocialAccountSchema.parse(input);

    return this.socialAccounts.create({
      workspace_id: account.workspaceId,
      provider: account.provider,
      provider_user_id: account.providerUserId,
      access_token: account.accessToken,
      refresh_token: account.refreshToken ?? null,
      token_expires_at: account.tokenExpiresAt ?? null,
      status: account.status,
    });
  }

  async listSocialAccounts(workspaceId: string) {
    return this.socialAccounts.listByWorkspace(workspaceIdSchema.parse(workspaceId));
  }

  async updateConnectionStatus(input: unknown) {
    const { socialAccountId, status, workspaceId } = updateSocialAccountStatusSchema.parse(input);
    return this.socialAccounts.updateStatus(socialAccountId, workspaceId, status);
  }
}
