const DEFAULT_GRAPH_API_VERSION = "v24.0";

export type MetaOAuthConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
  graphApiVersion: string;
};

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing Meta environment variable: ${name}.`);
  }

  return value;
}

/**
 * Server-side Meta OAuth configuration. App secrets must never be used in
 * browser code.
 */
export function getMetaOAuthConfig(): MetaOAuthConfig {
  return {
    appId: readRequiredEnv("META_APP_ID"),
    appSecret: readRequiredEnv("META_APP_SECRET"),
    redirectUri: readRequiredEnv("META_FACEBOOK_REDIRECT_URI"),
    graphApiVersion:
      process.env.META_GRAPH_API_VERSION || DEFAULT_GRAPH_API_VERSION,
  };
}
