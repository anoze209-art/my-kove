"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
   router.refresh();
  }
  return (
    <main className="min-h-screen bg-[#151A17] px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-gray-100"
          >
            My<span className="text-[#5FAF73]">Kove</span>
          </Link>

          <p className="mt-2 text-sm text-gray-400">
            Sign in to your Kove account
          </p>
        </div>

        <form
          onSubmit={handleSignIn}
          className="rounded-2xl border border-[#343B36] bg-[#202722] p-8 shadow-2xl"
        >

          {error && (
            <div className="mb-5 rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">
              {error}
            </div>
          )}


          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#4A514C] bg-[#F3F4F1] px-4 py-3 text-black placeholder:text-gray-500 outline-none transition focus:border-[#5FAF73] focus:ring-2 focus:ring-[#5FAF73]/20"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#4A514C] bg-[#F3F4F1] px-4 py-3 pr-20 text-black placeholder:text-gray-500 outline-none transition focus:border-[#5FAF73] focus:ring-2 focus:ring-[#5FAF73]/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 transition hover:text-[#267A43]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#4F9D63] px-6 py-3 font-semibold text-white transition hover:bg-[#438653] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#6FBE82] hover:text-[#8ACE98] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
        <p className="mt-6 text-center text-xs text-gray-600">
          One Place For Every Kove.
        </p>
      </div>
    </main>
  );
}
