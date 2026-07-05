"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthActionState } from "@/lib/auth/auth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import AuthFormMessage from "./AuthFormMessage";

const initialState: AuthActionState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <Card className="w-full max-w-md" padding="lg" variant="elevated">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-400">MarketFlow</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Create account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Start scheduling social content for Facebook and Instagram.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <AuthFormMessage error={state.error} />

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
            autoComplete="new-password"
            id="password"
            minLength={8}
            name="password"
            placeholder="At least 8 characters"
            required
            type="password"
          />
        </div>

        <Button className="w-full" isLoading={isPending} type="submit">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link className="font-medium text-blue-400 hover:text-blue-300" href="/auth/login">
          Log in
        </Link>
      </p>
    </Card>
  );
}
