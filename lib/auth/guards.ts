import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DASHBOARD_FALLBACK = "/dashboard/accounts";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Protects Server Components and layouts that require an authenticated session.
 */
export async function requireUser(redirectTo = DASHBOARD_FALLBACK) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return user;
}

/**
 * Keeps authenticated users out of public auth screens.
 */
export async function redirectAuthenticatedUser() {
  const user = await getCurrentUser();

  if (user) {
    redirect(DASHBOARD_FALLBACK);
  }
}
