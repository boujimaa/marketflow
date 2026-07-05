"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthActionState } from "@/lib/auth/auth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import AuthFormMessage from "./AuthFormMessage";

export type LoginFormProps = {
  message?: string;
  redirectTo?: string;
};

const initialState: AuthActionState = {};

export default function LoginForm({ message, redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <Card className="w-full max-w-md" padding="lg" variant="elevated">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-400">MarketFlow</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Log in to manage your Facebook and Instagram publishing workflow.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <input name="redirectTo" type="hidden" value={redirectTo || ""} />

        <AuthFormMessage error={state.error} message={message} />

        <div className="space-y-2">
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            autoComplete="current-password"
            id="password"
            minLength={8}
            name="password"
            placeholder="Enter your password"
            required
            type="password"
          />
        </div>

        <Button className="w-full" isLoading={isPending} type="submit">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to MarketFlow?{" "}
        <Link className="font-medium text-blue-400 hover:text-blue-300" href="/auth/register">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
