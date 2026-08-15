"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        // Check whether the user is actually signed in
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/sign-in");
          return;
        }

        setEmail(user.email ?? "");

        // Get the user's profile
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
    router.replace("/sign-in");
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
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-green-600">Kove</h1>
            <p className="text-sm text-gray-500">One Place For Every Kove.</p>
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-green-600">MYKOVE DASHBOARD</p>

          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Welcome back
            {profile?.full_name ? `, ${profile.full_name}` : ""}
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your Kove, discover spaces, and keep everything in one place.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Your account is signed in, but we couldn't load your profile yet.
            <br />
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* Account card */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Account</p>

            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              {profile?.full_name || "My Kove"}
            </h3>

            <p className="mt-2 break-all text-sm text-gray-500">{email}</p>

            {profile?.role && (
              <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {profile.role}
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">My Space</p>

            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              Find your Kove
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Discover spaces that fit your needs.
            </p>

            <button className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              Explore Spaces
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Profile</p>

            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              Your Information
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Keep your Kove profile up to date.
            </p>

            <button className="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main dashboard area */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900">
            Your MyKove
          </h3>

          <p className="mt-2 text-gray-500">
            This is your home base. More features will appear here as we build
            out MyKove.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">🏠</div>
              <p className="mt-3 font-medium">My Spaces</p>
              <p className="mt-1 text-sm text-gray-500">
                Your saved spaces
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">🔎</div>
              <p className="mt-3 font-medium">Explore</p>
              <p className="mt-1 text-sm text-gray-500">
                Find your next space
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">❤️</div>
              <p className="mt-3 font-medium">Saved</p>
              <p className="mt-1 text-sm text-gray-500">
                Places you like
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <div className="text-2xl">👤</div>
              <p className="mt-3 font-medium">Profile</p>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
