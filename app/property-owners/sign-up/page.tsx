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
  const [propertyName, setPropertyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          account_type: "property_owner",
          property_name: propertyName,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
if (data.user && data.session) {
  router.replace("/property-owners/dashboard");
  router.refresh();
} else if (data.user) {
  setError(
    "Account created. Please check your email to confirm your account before signing in."
  );
}
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
            Create your property account
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl"
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white">
              List Your Property
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Create an account to list and manage your property on MyKove.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-900 bg-red-950 p-3 text-sm text-red-300">
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
            placeholder="Your full name"
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-green-500"
          />
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Phone Number
          </label>

          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-green-500"
          />

          <label className="mb-2 block text-sm font-medium text-gray-300">
            Property Name
          </label>
          <input
            type="text"
            required
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            placeholder="Your Property Name"
            className="mb-5 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-green-500"
          />

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="mb-6 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Property Account"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have a property account?{" "}
            <Link
              href="/property-owners/sign-in"
              className="font-medium text-green-400 hover:text-green-300 hover:underline"
            >
              Sign in
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
      </div>
    </main>
  );
}
