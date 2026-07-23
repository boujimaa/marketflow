import { MetaProvider } from "./meta-provider";
import type { SocialProvider } from "./social-provider.interface";

export class ProviderFactory {
  private readonly providers: Map<string, SocialProvider>;

  constructor(providers: SocialProvider[] = [new MetaProvider()]) {
    this.providers = new Map(providers.map((provider) => [provider.id, provider]));
  }

  get(providerId: string): SocialProvider {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error(`Provider \"${providerId}\" is not configured.`);
    return provider;
  }
}
