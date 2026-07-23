import type {
  ProviderToken,
  SocialProvider,
  TokenRefreshResult,
  TokenValidationResult,
} from "./social-provider.interface";

/**
 * Meta is intentionally transport-free for now. It performs only local token
 * sanity checks; the same interface will contain Graph API calls when enabled.
 */
export class MetaProvider implements SocialProvider {
  readonly id = "meta";

  async validateToken(token: ProviderToken): Promise<TokenValidationResult> {
    if (!token.accessToken.trim()) return { valid: false, reason: "Access token is empty." };

    if (token.expiresAt && new Date(token.expiresAt).getTime() <= Date.now()) {
      return { valid: false, reason: "Access token has expired." };
    }

    return { valid: true };
  }

  async refreshToken(token: ProviderToken): Promise<TokenRefreshResult> {
    void token;

    return {
      refreshed: false,
      reason: "Meta token refresh is not configured. No Meta API call was made.",
    };
  }
}
