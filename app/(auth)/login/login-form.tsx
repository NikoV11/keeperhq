"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction, type AuthResult } from "../actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    loginAction,
    undefined
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-1">Welcome back</h1>
      <p className="text-brand-gray mb-6">Log in to your KeeperHQ dashboard.</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand-green py-2.5 font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {pending ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray">
        New to KeeperHQ?{" "}
        <Link href="/register" className="font-medium text-brand-green">
          Create an account
        </Link>
      </p>
    </div>
  );
}
