"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PropertyOwnerSignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/property-owners/dashboard");
    router.refresh();
  }
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-gray-100">
      <div className="mx-auto w-full max-w-md">

        <div className="mb-8 text-center">
          <Link
            href="/property-owners"
            className="text-2xl font-bold text-white"
          >
            My<span className="text-green-500">Kove</span>
          </Link>

          <p className="mt-2 text-sm text-gray-400">
            Property Owners & Managers
          </p>
        </div>

        <form
          onSubmit={handleSignIn}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl"
        >
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
              PROPERTY ACCOUNT
            </p>

            <h1 className="mt-2 text-2xl font-bold text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Sign in to manage your properties on MyKove.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-900 bg-red-950 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

       
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-green-500"
          />
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mb-6 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have a property account?{" "}
            <Link
              href="/property-owners/sign-up"
              className="font-medium text-green-400 hover:text-green-300 hover:underline"
            >
              List Your Property
            </Link>
          </p>

          <div className="mt-6 border-t border-gray-800 pt-5 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 transition hover:text-gray-300"
            >
              ← Back to MyKove
            </Link>
          </div>
        </form>
        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-4 text-center">
          <p className="text-xs leading-5 text-gray-500">
            Looking for a place to stay instead?
          </p>

          <Link
            href="/sign-in"
            className="mt-1 inline-block text-sm font-medium text-green-400 hover:text-green-300"
          >
            Sign in as a MyKove user
          </Link>
        </div>
      </div>
    </main>
  );
}
