"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
};

function StudentDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isNewUser = searchParams.get("welcome") === "new";

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/sign-in");
          return;
        }

        setEmail(user.email ?? "");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, phone, role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile error:", profileError);
          setError(profileError.message);
        }

        if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Something went wrong loading your dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">Kove</div>
          <p className="mt-2 text-gray-500">Loading your Kove...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <button
              onClick={() => router.push("/")}
              className="text-2xl font-bold text-green-600"
            >
              Kove
            </button>

            <p className="text-sm text-gray-500">
              One Place For Every Kove.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-green-600">
            MYKOVE DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {isNewUser ? "Welcome to MyKove" : "Welcome back"}
            {profile?.full_name ? `, ${profile.full_name}` : ""}
            {" 👋"}
          </h1>

          <p className="mt-2 text-gray-500">
            {isNewUser
              ? "Your MyKove journey starts here. Let's find your perfect space."
              : "Good to see you again. Here's your MyKove home base."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Your account is signed in, but we couldn't load your profile yet.
            <br />
            <span className="text-xs">{error}</span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Account</p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              {profile?.full_name || "My Kove"}
            </h2>

            <p className="mt-2 break-all text-sm text-gray-500">{email}</p>

            {profile?.role && (
              <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                {profile.role}
              </span>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">My Space</p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              Find your Kove
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Discover spaces that fit your needs.
            </p>

            <button
              onClick={() => router.push("/explore")}
              className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Explore Spaces
            </button>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Profile</p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              Your Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Keep your MyKove profile up to date.
            </p>

            <button
              onClick={() => router.push("/profile")}
              className="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Your MyKove</h2>

          <p className="mt-2 text-gray-500">
            Your home base for finding, saving, and managing spaces.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.push("/explore")}
              className="rounded-xl bg-gray-50 p-5 text-left transition hover:bg-gray-100"
            >
              <div className="text-2xl">🏠</div>
              <p className="mt-3 font-medium text-gray-900">
                Explore Spaces
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Find your next space.
              </p>
            </button>

            <button
              className="rounded-xl bg-gray-50 p-5 text-left transition hover:bg-gray-100"
            >
              <div className="text-2xl">❤️</div>
              <p className="mt-3 font-medium text-gray-900">Saved Spaces</p>
              <p className="mt-1 text-sm text-gray-500">
                Places you've saved.
              </p>
            </button>

            <button
              className="rounded-xl bg-gray-50 p-5 text-left transition hover:bg-gray-100"
            >
              <div className="text-2xl">📅</div>
              <p className="mt-3 font-medium text-gray-900">Bookings</p>
              <p className="mt-1 text-sm text-gray-500">
                Manage your bookings.
              </p>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="rounded-xl bg-gray-50 p-5 text-left transition hover:bg-gray-100"
            >
              <div className="text-2xl">👤</div>
              <p className="mt-3 font-medium text-gray-900">Profile</p>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account.
              </p>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">Kove</div>
            <p className="mt-2 text-gray-500">Loading your Kove...</p>
          </div>
        </main>
      }
    >
      <StudentDashboard />
    </Suspense>
  );
}

