"use client";

import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "./env";

let browserClient: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client for browser-side usage.
 * Use this from Client Components and browser-only integration flows.
 */
export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const { publishableKey, url } = getSupabaseEnvironment();

  browserClient = createBrowserClient(url, publishableKey);

  return browserClient;
}
