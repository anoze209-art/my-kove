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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            Kove
          </div>

          <p className="mt-2 text-gray-500">
            Loading your Kove...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-green-600">
              Kove
            </h1>
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
          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            {isNewUser ? "Welcome to MyKove" : "Welcome back"}
            {profile?.full_name ? `, ${profile.full_name}` : ""}
            {" 👋"}
          </h2>
          <p className="mt-2 text-gray-500">
            {isNewUser
              ? "Your MyKove journey starts here. Let's find your perfect space."
              : "Manage your Kove, discover spaces, and keep everything in one place."}
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
          <div className="rounded-2xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">
              Account
            </p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">
              {profile?.full_name || "My Kove"}
            </h3>
            <p className="mt-2 break-all text-sm text-gray-500">
              {email}
            </p>
