import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { metaOAuthCallbackSchema } from "@/lib/validation/meta-oauth.validation";
import { ProviderFactory } from "@/providers/provider-factory";
import { FacebookPageRepository } from "@/repositories/facebook-page.repository";
import { InstagramAccountRepository } from "@/repositories/instagram-account.repository";
import { SocialTokenRepository } from "@/repositories/social-token.repository";
import { WorkspaceRepository } from "@/repositories/workspace.repository";
import { FacebookPageService } from "@/services/facebook-page.service";
import { InstagramAccountService } from "@/services/instagram-account.service";
import { MetaOAuthService } from "@/services/meta-oauth.service";
import { SocialAuthService } from "@/services/social-auth.service";
import {
  FACEBOOK_OAUTH_STATE_COOKIE,
  clearFacebookOAuthStateCookie,
  parseFacebookOAuthStateCookie,
} from "@/server/meta/oauth-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function accountsRedirect(request: NextRequest, status: "connected" | "error") {
  return new URL(`/dashboard/accounts?facebook=${status}`, request.url);
}

export async function GET(request: NextRequest) {
  const callback = metaOAuthCallbackSchema.safeParse({
    code: request.nextUrl.searchParams.get("code") ?? undefined,
    state: request.nextUrl.searchParams.get("state") ?? undefined,
    error: request.nextUrl.searchParams.get("error") ?? undefined,
    errorDescription: request.nextUrl.searchParams.get("error_description") ?? undefined,
  });
  const storedState = parseFacebookOAuthStateCookie(
    request.cookies.get(FACEBOOK_OAUTH_STATE_COOKIE)?.value,
  );
  const user = await getCurrentUser();

  if (!callback.success || callback.data.error || !callback.data.code || !callback.data.state || !storedState || !user) {
    const response = NextResponse.redirect(accountsRedirect(request, "error"));
    clearFacebookOAuthStateCookie(response);

    return response;
  }

  if (storedState.state !== callback.data.state || storedState.userId !== user.id) {
    const response = NextResponse.redirect(accountsRedirect(request, "error"));
    clearFacebookOAuthStateCookie(response);

    return response;
  }

  try {
    const client = await createSupabaseServerClient();
    const workspace = await new WorkspaceRepository(client).findById(storedState.workspaceId);
    if (!workspace) throw new Error("Workspace access was revoked before Meta OAuth completed.");

    const socialAuth = new SocialAuthService(new SocialTokenRepository(client), new ProviderFactory());
    const metaOAuth = new MetaOAuthService(
      socialAuth,
      new FacebookPageService(new FacebookPageRepository(client), socialAuth),
      new InstagramAccountService(new InstagramAccountRepository(client)),
    );
    await metaOAuth.completeConnection({ workspaceId: storedState.workspaceId, code: callback.data.code });

    const response = NextResponse.redirect(
      accountsRedirect(request, "connected"),
    );
    clearFacebookOAuthStateCookie(response);

    return response;
  } catch (error) {
    console.error("Facebook OAuth callback failed", error);

    const response = NextResponse.redirect(accountsRedirect(request, "error"));
    clearFacebookOAuthStateCookie(response);

    return response;
  }
}
