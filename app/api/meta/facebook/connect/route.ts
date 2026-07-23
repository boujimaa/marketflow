import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { metaOAuthStartSchema } from "@/lib/validation/meta-oauth.validation";
import { ProviderFactory } from "@/providers/provider-factory";
import { FacebookPageRepository } from "@/repositories/facebook-page.repository";
import { InstagramAccountRepository } from "@/repositories/instagram-account.repository";
import { SocialTokenRepository } from "@/repositories/social-token.repository";
import { WorkspaceRepository } from "@/repositories/workspace.repository";
import { FacebookPageService } from "@/services/facebook-page.service";
import { InstagramAccountService } from "@/services/instagram-account.service";
import { MetaOAuthService } from "@/services/meta-oauth.service";
import { SocialAuthService } from "@/services/social-auth.service";
import { setFacebookOAuthStateCookie } from "@/server/meta/oauth-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login?redirectTo=/dashboard/accounts", request.url),
    );
  }

  const parsed = metaOAuthStartSchema.safeParse({
    workspaceId: request.nextUrl.searchParams.get("workspaceId"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/dashboard/accounts?facebook=error", request.url));
  }

  const client = await createSupabaseServerClient();
  const workspace = await new WorkspaceRepository(client).findById(parsed.data.workspaceId);

  if (!workspace) {
    return NextResponse.redirect(new URL("/dashboard/accounts?facebook=error", request.url));
  }

  const state = crypto.randomUUID();
  const socialAuth = new SocialAuthService(new SocialTokenRepository(client), new ProviderFactory());
  const metaOAuth = new MetaOAuthService(
    socialAuth,
    new FacebookPageService(new FacebookPageRepository(client), socialAuth),
    new InstagramAccountService(new InstagramAccountRepository(client)),
  );
  const authorizationUrl = metaOAuth.createAuthorizationUrl(state);
  const response = NextResponse.redirect(authorizationUrl);

  setFacebookOAuthStateCookie(response, {
    state,
    userId: user.id,
    workspaceId: parsed.data.workspaceId,
  });

  return response;
}
