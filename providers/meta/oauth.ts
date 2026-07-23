import { getMetaOAuthConfig } from "@/lib/meta/config";
import { META_REQUIRED_PERMISSIONS } from "./permissions";

type MetaTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: { message?: string };
};

export type MetaAccessToken = {
  accessToken: string;
  tokenType: string;
  expiresAt: string | null;
};

function expiresAt(expiresIn?: number): string | null {
  return expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;
}

async function requestToken(url: URL, fallbackMessage: string): Promise<MetaAccessToken> {
  const response = await fetch(url, { cache: "no-store" });
  const payload = (await response.json()) as MetaTokenResponse;

  if (!response.ok || payload.error || !payload.access_token) {
    throw new Error(payload.error?.message ?? fallbackMessage);
  }

  return {
    accessToken: payload.access_token,
    tokenType: payload.token_type ?? "Bearer",
    expiresAt: expiresAt(payload.expires_in),
  };
}

export function createMetaAuthorizationUrl(state: string): URL {
  const config = getMetaOAuthConfig();
  const url = new URL(`https://www.facebook.com/${config.graphApiVersion}/dialog/oauth`);

  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", META_REQUIRED_PERMISSIONS.join(","));

  return url;
}

export async function exchangeMetaAuthorizationCode(code: string): Promise<MetaAccessToken> {
  const config = getMetaOAuthConfig();
  const url = new URL(`https://graph.facebook.com/${config.graphApiVersion}/oauth/access_token`);

  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("code", code);

  return requestToken(url, "Meta did not return an access token.");
}

export async function exchangeForLongLivedMetaToken(
  shortLivedToken: string,
): Promise<MetaAccessToken> {
  const config = getMetaOAuthConfig();
  const url = new URL(`https://graph.facebook.com/${config.graphApiVersion}/oauth/access_token`);

  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("fb_exchange_token", shortLivedToken);

  return requestToken(url, "Meta did not return a long-lived access token.");
}
