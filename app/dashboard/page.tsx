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
  const [isNewUser, setIsNewUser] = useState(false);

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
          .select("id, full_name, phone, role, has_seen_welcome")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile error:", profileError);
          setError(profileError.message);
        }

        if (profileData) {
          setProfile(profileData);

          const isFirstVisit = profileData.has_seen_welcome === false;

          setIsNewUser(isFirstVisit);

          if (isFirstVisit) {
            await supabase
              .from("profiles")
              .update({ has_seen_welcome: true })
              .eq("id", user.id);
          }
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
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            My<span className="text-green-500">Kove</span>
          </div>

          <p className="mt-2 text-gray-400">
            Loading your Kove...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* NAVBAR */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold"
          >
            My<span className="text-green-500">Kove</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/explore")}
              className="hidden rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-green-500 hover:text-green-400 sm:block"
            >
              Explore
            </button>

            <button
              onClick={handleSignOut}
              className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-red-500 hover:text-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        {/* WELCOME */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            MYKOVE DASHBOARD
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Welcome
            {profile?.full_name ? `, ${profile.full_name}` : ""} 👋
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            {isNewUser
              ? "Your MyKove journey starts here. Let’s find your perfect space."
              : "Manage your Kove, discover spaces, and keep everything in one place."}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-yellow-800 bg-yellow-950/40 p-4 text-sm text-yellow-300">
            <p className="font-medium">
              Your account is signed in, but we couldn't load your profile yet.
            </p>
            <p className="mt-1 text-xs text-yellow-400/80">
              {error}
            </p>
          </div>
        )}

        {/* MAIN CARDS */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* ACCOUNT */}
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-7 transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
              👤
            </div>

            <p className="mt-6 text-sm font-medium text-gray-500">
              ACCOUNT
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              {profile?.full_name || "My Kove"}
            </h2>

            <p className="mt-2 break-all text-sm text-gray-400">
              {email}
            </p>

            {profile?.role && (
              <span className="mt-5 inline-block rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                {profile.role}
              </span>
            )}
          </div>

          {/* EXPLORE */}
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-7 transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
              🔎
            </div>

            <p className="mt-6 text-sm font-medium text-gray-500">
              MY SPACE
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Find your Kove
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Discover spaces that fit your needs, location, and budget.
            </p>

            <button
              onClick={() => router.push("/explore")}
              className="mt-6 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Explore Spaces
            </button>
          </div>

          {/* PROFILE */}
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-7 transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
              ⚙️
            </div>

            <p className="mt-6 text-sm font-medium text-gray-500">
              PROFILE
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Your Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Keep your MyKove profile information up to date.
            </p>

            <button
              onClick={() => router.push("/profile")}
              className="mt-6 rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-green-500 hover:text-green-400"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* YOUR MYKOVE */}
        <div className="mt-8 rounded-3xl border border-gray-800 bg-gray-900 p-7 sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-500">
              YOUR MYKOVE
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Your home base
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Everything you need to discover, save, and manage your favourite
              spaces will live here.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* MY SPACES */}
            <button
              onClick={() => router.push("/explore")}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-green-600 hover:bg-gray-900"
            >
              <div className="text-2xl">🏠</div>

              <p className="mt-4 font-semibold text-white">
                My Spaces
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your saved spaces
              </p>
            </button>

            {/* EXPLORE */}
            <button
              onClick={() => router.push("/explore")}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-green-600 hover:bg-gray-900"
            >
              <div className="text-2xl">🔎</div>

              <p className="mt-4 font-semibold text-white">
                Explore
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Find your next space
              </p>
            </button>

            {/* SAVED */}
            <button
              onClick={() => router.push("/explore")}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-green-600 hover:bg-gray-900"
            >
              <div className="text-2xl">❤️</div>

              <p className="mt-4 font-semibold text-white">
                Saved
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Places you like
              </p>
            </button>

            {/* PROFILE */}
            <button
              onClick={() => router.push("/profile")}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-green-600 hover:bg-gray-900"
            >
              <div className="text-2xl">👤</div>

              <p className="mt-4 font-semibold text-white">
                Profile
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account
              </p>
            </button>
          </div>
        </div>

        {/* PROPERTY OWNER CTA */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-green-900/50 bg-green-950/30 p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-500">
              HAVE A PROPERTY?
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Want to list a property on MyKove?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              If you own or manage a property, you can create a separate
              property account and start managing your listings.
            </p>

            <button
              onClick={() => router.push("/property-owners")}
              className="mt-7 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500"
            >
              I Have a Property
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
