import { NextRequest, NextResponse } from "next/server";
import { createFacebookAuthorizationUrl } from "@/lib/meta/oauth";
import { getCurrentUser } from "@/lib/auth/guards";
import { setFacebookOAuthStateCookie } from "@/server/meta/oauth-state";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login?redirectTo=/dashboard/accounts", request.url),
    );
  }

  const state = crypto.randomUUID();
  const authorizationUrl = createFacebookAuthorizationUrl(state);
  const response = NextResponse.redirect(authorizationUrl);

  setFacebookOAuthStateCookie(response, {
    state,
    userId: user.id,
  });

  return response;
}
