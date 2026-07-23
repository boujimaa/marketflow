import { getMetaOAuthConfig } from "@/lib/meta/config";

type MetaGraphErrorPayload = { error?: { code?: number; message?: string; type?: string } };

export class MetaGraphApiError extends Error {
  constructor(
    message: string,
    readonly code?: number,
  ) {
    super(message);
  }

  get isAuthorizationError() {
    return this.code === 190 || this.code === 102;
  }
}

export class MetaGraphApi {
  constructor(private readonly accessToken: string) {}

  async get<T>(path: string, parameters: Record<string, string> = {}): Promise<T> {
    const { graphApiVersion } = getMetaOAuthConfig();
    const url = new URL(`https://graph.facebook.com/${graphApiVersion}${path}`);

    url.searchParams.set("access_token", this.accessToken);
    for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);

    const response = await fetch(url, { cache: "no-store" });
    const payload = (await response.json()) as T & MetaGraphErrorPayload;

    if (!response.ok || payload.error) {
      throw new MetaGraphApiError(
        payload.error?.message ?? "Meta Graph API request failed.",
        payload.error?.code,
      );
    }

    return payload;
  }
}
