import type { MetaInstagramBusinessAccount } from "@/providers/meta/instagram";
import { InstagramAccountRepository } from "@/repositories/instagram-account.repository";

export class InstagramAccountService {
  constructor(private readonly accounts: InstagramAccountRepository) {}

  async storeBusinessAccount(input: {
    workspaceId: string;
    facebookPageId: string;
    account: MetaInstagramBusinessAccount;
  }) {
    return this.accounts.upsert({
      workspace_id: input.workspaceId,
      facebook_page_id: input.facebookPageId,
      instagram_id: input.account.id,
      username: input.account.username,
      profile_picture_url: input.account.profilePictureUrl,
      connected: true,
      status: "connected",
    });
  }
}
