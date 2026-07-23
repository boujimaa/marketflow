import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnvironment } from "./env";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for server-side usage.
 * Keep this helper in Server Components, Server Actions, and Route Handlers only.
 */
export async function createSupabaseServerClient() {
  const { publishableKey, url } = getSupabaseEnvironment();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Server Actions and Route
          // Handlers will persist refreshed auth cookies through this branch.
        }
      },
    },
  });
}
