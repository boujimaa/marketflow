import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import {
  connectProviderSchema,
  socialTokenIdSchema,
} from "@/lib/validation/social-auth.validation";
import { workspaceIdSchema } from "@/lib/validation/workspace";
import { ProviderFactory } from "@/providers/provider-factory";
import type { ProviderToken } from "@/providers/social-provider.interface";
import { SocialTokenRepository } from "@/repositories/social-token.repository";
import type { Database } from "@/types/database";

type StoredToken = Database["public"]["Tables"]["social_tokens"]["Row"];

function getEncryptionKey(): Buffer {
  const configuredKey = process.env.SOCIAL_TOKEN_ENCRYPTION_KEY?.trim();
  if (!configuredKey) throw new Error("Missing SOCIAL_TOKEN_ENCRYPTION_KEY.");

  const key = /^[0-9a-f]{64}$/i.test(configuredKey)
    ? Buffer.from(configuredKey, "hex")
    : Buffer.from(configuredKey, "base64");

  if (key.length !== 32) {
    throw new Error("SOCIAL_TOKEN_ENCRYPTION_KEY must be a 32-byte base64 value or 64-character hex value.");
  }

  return key;
}

function encrypt(value: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return ["v1", iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(".");
}

function decrypt(value: string, key: Buffer): string {
  const [version, encodedIv, encodedTag, encodedCiphertext] = value.split(".");
  if (version !== "v1" || !encodedIv || !encodedTag || !encodedCiphertext) {
    throw new Error("Stored social token has an unsupported encryption format.");
  }

  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(encodedIv, "base64url"));
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export class SocialAuthService {
  private readonly encryptionKey: Buffer;

  constructor(
    private readonly tokens: SocialTokenRepository,
    private readonly providers: ProviderFactory,
    encryptionKey = getEncryptionKey(),
  ) {
    this.encryptionKey = encryptionKey;
  }

  async connectProvider(input: unknown) {
    const connection = connectProviderSchema.parse(input);
    const provider = this.providers.get(connection.provider);
    const token: ProviderToken = {
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken ?? null,
      tokenType: connection.tokenType,
      expiresAt: connection.expiresAt ?? null,
      scopes: connection.scopes,
    };
    const validation = await provider.validateToken(token);

    if (!validation.valid) throw new Error(validation.reason ?? "Provider token is invalid.");

    const stored = await this.tokens.upsert({
      workspace_id: connection.workspaceId,
      provider: connection.provider,
      provider_user_id: connection.providerUserId,
      access_token: encrypt(token.accessToken, this.encryptionKey),
      refresh_token: token.refreshToken ? encrypt(token.refreshToken, this.encryptionKey) : null,
      token_type: token.tokenType,
      expires_at: token.expiresAt,
      scopes: token.scopes,
      metadata: connection.metadata,
    });

    return this.toSafeConnection(stored);
  }

  async disconnectProvider(input: unknown): Promise<void> {
    const { tokenId, workspaceId } = socialTokenIdSchema.parse(input);
    await this.tokens.delete(tokenId, workspaceId);
  }

  async getConnectedProviders(workspaceId: string) {
    const connections = await this.tokens.listByWorkspace(workspaceIdSchema.parse(workspaceId));
    const accountCounts = new Map<string, number>();

    for (const connection of connections) {
      accountCounts.set(connection.provider, (accountCounts.get(connection.provider) ?? 0) + 1);
    }

    return [...accountCounts].map(([provider, accountCount]) => ({ provider, accountCount }));
  }

  async validateToken(input: unknown) {
    const { tokenId, workspaceId } = socialTokenIdSchema.parse(input);
    const stored = await this.requireToken(tokenId, workspaceId);
    return this.providers.get(stored.provider).validateToken(this.toProviderToken(stored));
  }

  async refreshToken(input: unknown) {
    const { tokenId, workspaceId } = socialTokenIdSchema.parse(input);
    const stored = await this.requireToken(tokenId, workspaceId);
    const refreshed = await this.providers.get(stored.provider).refreshToken(this.toProviderToken(stored));

    if (!refreshed.refreshed) return refreshed;

    const updated = await this.tokens.updateTokens(tokenId, workspaceId, {
      workspace_id: workspaceId,
      provider: stored.provider,
      provider_user_id: stored.provider_user_id,
      access_token: encrypt(refreshed.token.accessToken, this.encryptionKey),
      refresh_token: refreshed.token.refreshToken
        ? encrypt(refreshed.token.refreshToken, this.encryptionKey)
        : null,
      token_type: refreshed.token.tokenType,
      expires_at: refreshed.token.expiresAt,
      scopes: refreshed.token.scopes,
      metadata: stored.metadata,
    });

    return { refreshed: true as const, connection: this.toSafeConnection(updated) };
  }

  private async requireToken(tokenId: string, workspaceId: string): Promise<StoredToken> {
    const token = await this.tokens.findById(tokenId, workspaceId);
    if (!token) throw new Error("Social connection not found.");
    return token;
  }

  private toProviderToken(token: StoredToken): ProviderToken {
    return {
      accessToken: decrypt(token.access_token, this.encryptionKey),
      refreshToken: token.refresh_token ? decrypt(token.refresh_token, this.encryptionKey) : null,
      tokenType: token.token_type,
      expiresAt: token.expires_at,
      scopes: token.scopes,
    };
  }

  private toSafeConnection(token: StoredToken) {
    return {
      id: token.id,
      workspaceId: token.workspace_id,
      provider: token.provider,
      providerUserId: token.provider_user_id,
      tokenType: token.token_type,
      expiresAt: token.expires_at,
      scopes: token.scopes,
      metadata: token.metadata,
      createdAt: token.created_at,
      updatedAt: token.updated_at,
    };
  }
}
