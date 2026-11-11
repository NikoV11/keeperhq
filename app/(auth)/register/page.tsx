"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type AuthResult } from "../actions";

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Ireland", "Australia",
  "Germany", "Netherlands", "Spain", "Portugal", "Other",
];

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    registerAction,
    undefined
  );
  const [dob, setDob] = useState("");
  const age = calculateAge(dob);
  const isMinor = age !== null && age < 18;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-1">Join KeeperHQ</h1>
      <p className="text-brand-gray mb-6">Create your free account to get started.</p>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Full name</label>
          <input
            name="full_name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
          />
        </div>

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
            minLength={8}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
          />
          <p className="mt-1 text-xs text-brand-gray">At least 8 characters.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Date of birth</label>
            <input
              name="dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Country</label>
            <select
              name="country"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
            >
              <option value="">Select...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {isMinor && (
          <div className="rounded-lg bg-brand-gray-light p-4 space-y-3">
            <p className="text-sm font-medium text-brand-black">
              Since this goalkeeper is under 18, a parent/guardian must be on file.
            </p>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Parent/guardian name</label>
              <input
                name="parent_name"
                required={isMinor}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Parent/guardian email</label>
              <input
                name="parent_email"
                type="email"
                required={isMinor}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Parent/guardian phone</label>
              <input
                name="parent_phone"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>
        )}

        <label className="flex items-start gap-2 text-sm text-brand-gray">
          <input name="accept_terms" type="checkbox" required className="mt-1" />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="text-brand-green">Terms &amp; Conditions</Link>,{" "}
            <Link href="/legal/privacy" className="text-brand-green">Privacy Policy</Link>, and{" "}
            <Link href="/legal/waiver" className="text-brand-green">Liability Waiver</Link>.
          </span>
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand-green py-2.5 font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray">
        Already a member?{" "}
        <Link href="/login" className="font-medium text-brand-green">Log in</Link>
      </p>
    </div>
  );
}
