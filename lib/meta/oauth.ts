import { getMetaOAuthConfig } from "./config";

const FACEBOOK_OAUTH_SCOPES = ["public_profile", "email"];

type MetaTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

export type FacebookLongLivedToken = {
  accessToken: string;
  tokenType: string;
  expiresAt: string | null;
};

function assertTokenResponse(
  response: MetaTokenResponse,
  fallbackMessage: string,
) {
  if (response.error || !response.access_token) {
    throw new Error(response.error?.message || fallbackMessage);
  }

  return response.access_token;
}

function getExpiresAt(expiresIn?: number) {
  if (!expiresIn) {
    return null;
  }

  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

export function createFacebookAuthorizationUrl(state: string) {
  const config = getMetaOAuthConfig();
  const authorizationUrl = new URL(
    `https://www.facebook.com/${config.graphApiVersion}/dialog/oauth`,
  );

  authorizationUrl.searchParams.set("client_id", config.appId);
  authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("scope", FACEBOOK_OAUTH_SCOPES.join(","));

  return authorizationUrl;
}

export async function exchangeFacebookCodeForLongLivedToken(
  code: string,
): Promise<FacebookLongLivedToken> {
  const config = getMetaOAuthConfig();
  const shortLivedUrl = new URL(
    `https://graph.facebook.com/${config.graphApiVersion}/oauth/access_token`,
  );

  shortLivedUrl.searchParams.set("client_id", config.appId);
  shortLivedUrl.searchParams.set("client_secret", config.appSecret);
  shortLivedUrl.searchParams.set("redirect_uri", config.redirectUri);
  shortLivedUrl.searchParams.set("code", code);

  const shortLivedResponse = await fetch(shortLivedUrl, {
    cache: "no-store",
  });
  const shortLivedJson =
    (await shortLivedResponse.json()) as MetaTokenResponse;
  const shortLivedToken = assertTokenResponse(
    shortLivedJson,
    "Meta did not return a short-lived access token.",
  );

  const longLivedUrl = new URL(
    `https://graph.facebook.com/${config.graphApiVersion}/oauth/access_token`,
  );

  longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
  longLivedUrl.searchParams.set("client_id", config.appId);
  longLivedUrl.searchParams.set("client_secret", config.appSecret);
  longLivedUrl.searchParams.set("fb_exchange_token", shortLivedToken);

  const longLivedResponse = await fetch(longLivedUrl, {
    cache: "no-store",
  });
  const longLivedJson = (await longLivedResponse.json()) as MetaTokenResponse;
  const longLivedToken = assertTokenResponse(
    longLivedJson,
    "Meta did not return a long-lived access token.",
  );

  return {
    accessToken: longLivedToken,
    tokenType: longLivedJson.token_type || "bearer",
    expiresAt: getExpiresAt(longLivedJson.expires_in),
  };
}
