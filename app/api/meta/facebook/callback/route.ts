import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { exchangeFacebookCodeForLongLivedToken } from "@/lib/meta/oauth";
import { storeFacebookConnection } from "@/server/meta/connections";
import {
  FACEBOOK_OAUTH_STATE_COOKIE,
  clearFacebookOAuthStateCookie,
  parseFacebookOAuthStateCookie,
} from "@/server/meta/oauth-state";

function accountsRedirect(request: NextRequest, status: "connected" | "error") {
  return new URL(`/dashboard/accounts?facebook=${status}`, request.url);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const metaError = searchParams.get("error");
  const storedState = parseFacebookOAuthStateCookie(
    request.cookies.get(FACEBOOK_OAUTH_STATE_COOKIE)?.value,
  );
  const user = await getCurrentUser();

  if (metaError || !code || !state || !storedState || !user) {
    const response = NextResponse.redirect(accountsRedirect(request, "error"));
    clearFacebookOAuthStateCookie(response);

    return response;
  }

  if (storedState.state !== state || storedState.userId !== user.id) {
    const response = NextResponse.redirect(accountsRedirect(request, "error"));
    clearFacebookOAuthStateCookie(response);

    return response;
  }

  try {
    const token = await exchangeFacebookCodeForLongLivedToken(code);

    await storeFacebookConnection({
      token,
      userId: user.id,
    });

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
