export type ProviderToken = {
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresAt: string | null;
  scopes: string[];
};

export type TokenValidationResult = {
  valid: boolean;
  reason?: string;
};

export type TokenRefreshResult =
  | { refreshed: false; reason: string }
  | { refreshed: true; token: ProviderToken };

/** A platform adapter. Network calls belong in adapter implementations only. */
export interface SocialProvider {
  readonly id: string;
  validateToken(token: ProviderToken): Promise<TokenValidationResult>;
  refreshToken(token: ProviderToken): Promise<TokenRefreshResult>;
}
