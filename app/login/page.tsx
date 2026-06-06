"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { logIn } from "../../lib/auth-actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(logIn, undefined);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">
          Log in
        </h1>

        <form action={formAction} className="space-y-4">
          {from && <input type="hidden" name="from" value={from} />}
          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {state.error}
            </p>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-neutral-600 text-center">
          Don&apos;t have an account?{" "}
          <Link href={from ? `/signup?from=${encodeURIComponent(from)}` : "/signup"} className="font-medium text-neutral-900 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
