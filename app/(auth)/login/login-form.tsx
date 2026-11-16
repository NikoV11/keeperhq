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
      <h1 className="text-2xl font-bold text-ink mb-1">Welcome back</h1>
      <p className="text-ink-muted mb-6">Log in to your KeeperHQ dashboard.</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-line px-3 py-2 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-line px-3 py-2 focus:border-gold focus:outline-none"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gold py-2.5 font-bold text-ink hover:bg-[#ffc23d] disabled:opacity-60"
        >
          {pending ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New to KeeperHQ?{" "}
        <Link href="/register" className="font-medium text-gold-dark">
          Create an account
        </Link>
      </p>
    </div>
  );
}
