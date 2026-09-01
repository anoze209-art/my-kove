"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PropertyOwnersDashboard() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  async function handleSignOut() {
    setSigningOut(true);

    await supabase.auth.signOut();
    router.replace("/property-owners/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              My<span className="text-green-500">Kove</span>
            </h1>
            <p className="text-xs text-gray-400">
              Property Owners
            </p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 hover:text-white disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-500">
            PROPERTY OWNER DASHBOARD
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome 👋
          </h2>

          <p className="mt-3 max-w-2xl text-gray-400">
            Manage your properties, keep your listings updated, and grow your
            presence on MyKove.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-green-500">
                GET STARTED
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                List your property
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Add your property to MyKove and make it easier for people
                looking for a place to stay to discover it.
              </p>
            </div>

            <button
              onClick={() => router.push("/property-owners/list-property")}
              className="w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 md:w-auto"
            >
              List Your Property
            </button>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white">
            Overview
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            A quick look at your property activity.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-2xl">
              🏠
            </div>

            <p className="mt-5 text-sm text-gray-400">
              My Properties
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              0
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Properties listed
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-2xl">
              ✓
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Verified
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              0
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Verified properties
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-2xl">
              ⏳
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Pending
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              0
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Awaiting verification
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-2xl">
              👥
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Managers
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              0
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Staff or managers
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold text-white">
            Manage Your Kove
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Everything you need to manage your property presence.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <button
              onClick={() =>
                router.push("/property-owners/properties")
              }
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-800 hover:bg-gray-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-2xl">
                🏘️
              </div>

              <h4 className="mt-5 text-lg font-bold text-white">
                My Properties
              </h4>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                View, edit, and manage all your listed properties.
              </p>

              <p className="mt-5 text-sm font-semibold text-green-500 group-hover:text-green-400">
                Manage properties →
              </p>
            </button>
            <button
              onClick={() =>
                router.push("/property-owners/managers")
              }
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-800 hover:bg-gray-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-2xl">
                👤
              </div>
              <h4 className="mt-5 text-lg font-bold text-white">
                Managers & Staff
              </h4>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Give trusted staff members access to help manage your
                properties.
              </p>
              <p className="mt-5 text-sm font-semibold text-green-500 group-hover:text-green-400">
                Manage staff →
              </p>
            </button>
            <button
              onClick={() =>
                router.push("/property-owners/verification")
              }
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-800 hover:bg-gray-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-2xl">
                🛡️
              </div>

              <h4 className="mt-5 text-lg font-bold text-white">
                Verification
              </h4>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Learn about property verification and build trust with
                potential customers.
              </p>

              <p className="mt-5 text-sm font-semibold text-green-500 group-hover:text-green-400">
                View verification →
              </p>
            </button>
          </div>
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-gray-700 bg-gray-900/70 px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-3xl">
            🏠
          </div>
          <h3 className="mt-5 text-xl font-bold text-white">
            No properties yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
            Your properties will appear here once you list them on MyKove.
          </p>
          <button
            onClick={() =>
              router.push("/property-owners/list-property")
            }
            className="mt-6 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            List Your First Property
          </button>
        </div>
      </section>
    </main>
  );
}
