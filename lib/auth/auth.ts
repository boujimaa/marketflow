"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getRedirectPath(formData: FormData) {
  const redirectTo = getString(formData, "redirectTo");

  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard/accounts";
  }

  return redirectTo;
}

function validateCredentials(email: string, password: string) {
  if (!email) {
    return "Email is required.";
  }

  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

export async function login(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const redirectTo = getRedirectPath(formData);
  const validationError = validateCredentials(email, password);

  if (validationError) {
    return { error: validationError };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo);
}

export async function register(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const validationError = validateCredentials(email, password);

  if (validationError) {
    return { error: validationError };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect("/dashboard/accounts");
  }

  redirect("/auth/login?message=Check%20your%20email%20to%20confirm%20your%20account.");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect("/auth/login");
}
