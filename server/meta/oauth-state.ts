import type { NextResponse } from "next/server";

export const FACEBOOK_OAUTH_STATE_COOKIE = "marketflow-facebook-oauth-state";

const COOKIE_MAX_AGE_SECONDS = 10 * 60;

export type FacebookOAuthStateCookie = {
  state: string;
  userId: string;
};

export function createFacebookOAuthStateCookieValue(
  value: FacebookOAuthStateCookie,
) {
  return JSON.stringify(value);
}

export function parseFacebookOAuthStateCookie(
  value?: string,
): FacebookOAuthStateCookie | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<FacebookOAuthStateCookie>;

    if (!parsed.state || !parsed.userId) {
      return null;
    }

    return {
      state: parsed.state,
      userId: parsed.userId,
    };
  } catch {
    return null;
  }
}

export function setFacebookOAuthStateCookie(
  response: NextResponse,
  value: FacebookOAuthStateCookie,
) {
  response.cookies.set(
    FACEBOOK_OAUTH_STATE_COOKIE,
    createFacebookOAuthStateCookieValue(value),
    {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

export function clearFacebookOAuthStateCookie(response: NextResponse) {
  response.cookies.set(FACEBOOK_OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
