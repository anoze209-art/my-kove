"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PropertyOwnerSignUp() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          account_type: "property_owner",
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/property-owners/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">
            My<span className="text-green-500">Kove</span>
          </Link>

          <p className="mt-3 text-sm text-gray-400">
            Create your property account
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-xl"
        >
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-widest text-green-500">
              PROPERTY MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold text-white">
              List your property on MyKove
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Create your account to manage properties and reach people
              looking for their next Kove.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <label className="mb-2 block text-sm font-medium text-gray-300">
            Full Name
          </label>

          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Your full name"
          />

          <label className="mb-2 block text-sm font-medium text-gray-300">
            Phone Number
          </label>

          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Your phone number"
          />

          <label className="mb-2 block text-sm font-medium text-gray-300">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Your email"
          />

          <label className="mb-2 block text-sm font-medium text-gray-300">
            Password
          </label>

          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 pr-24 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="Create a password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 transition hover:text-green-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Property Account"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have a property account?{" "}
            <Link
              href="/property-owners/sign-in"
              className="font-medium text-green-500 hover:underline"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-6 border-t border-gray-800 pt-5 text-center">
            <Link
              href="/property-owners"
              className="text-sm text-gray-500 transition hover:text-white"
            >
              ← Back to Property Owners
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
