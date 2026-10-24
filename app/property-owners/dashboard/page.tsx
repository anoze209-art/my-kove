"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  price_period: string;
  units: number;
  status: string;
  verified: boolean;
  authorization_status: string | null;
  provisional_expires_at: string | null;
  cover_photo: string | null;
};

const PHOTO_BUCKET = "property photo";

function getPhotoUrl(path: string | null) {
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) return path;

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);

  return data.publicUrl;
}

function getProvisionalDaysLeft(property: Property) {
  if (
    property.status !== "active" ||
    property.authorization_status !== "not_submitted" ||
    !property.provisional_expires_at
  ) {
    return null;
  }

  const msLeft =
    new Date(property.provisional_expires_at).getTime() - Date.now();

  if (msLeft <= 0) return null;

  return Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}

function isProvisionalExpired(property: Property) {
  if (property.status === "expired") return true;

  if (
    property.status !== "active" ||
    property.authorization_status !== "not_submitted" ||
    !property.provisional_expires_at
  ) {
    return false;
  }

  return new Date(property.provisional_expires_at).getTime() <= Date.now();
}

function getStatusBadge(property: Property) {
  if (property.verified) {
    return { label: "✓ Verified", className: "bg-green-950 text-green-400" };
  }

  if (property.status === "suspended") {
    return { label: "Suspended", className: "bg-red-950 text-red-400" };
  }

  if (property.status === "rejected") {
    return { label: "Rejected", className: "bg-red-950 text-red-400" };
  }

  if (property.status === "pending_review") {
    return { label: "Under review", className: "bg-yellow-950 text-yellow-400" };
  }

  if (isProvisionalExpired(property)) {
    return { label: "Expired", className: "bg-red-950 text-red-400" };
  }

  if (getProvisionalDaysLeft(property) !== null) {
    return {
      label: "Not Yet Verified",
      className: "bg-amber-950 text-amber-400",
    };
  }

  if (property.status === "active") {
    return { label: "Live", className: "bg-green-950 text-green-400" };
  }

  return { label: property.status, className: "bg-gray-800 text-gray-400" };
}

export default function PropertyOwnersDashboard() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/property-owners/sign-in");
        return;
      }

      const { data: organization, error: organizationError } = await supabase
        .from("organization")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (organizationError) {
        throw organizationError;
      }

      if (!organization) {
        setProperties([]);
        return;
      }

      const { data, error: propertiesError } = await supabase
        .from("properties")
        .select(
          "id, name, type, location, price, price_period, units, status, verified, authorization_status, provisional_expires_at, cover_photo"
        )
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: false });

      if (propertiesError) {
        throw propertiesError;
      }

      setProperties((data || []) as Property[]);
    } catch (err) {
      console.error("Dashboard error:", err);

      const message =
        err &&
        typeof err === "object" &&
        "message" in err
          ? String(err.message)
          : "Could not load your properties.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    await supabase.auth.signOut();

    router.replace("/property-owners/sign-in");
  }

  const totalProperties = properties.length;

  const verifiedProperties = properties.filter(
    (property) => property.verified === true
  ).length;

  const awaitingProperties = properties.filter(
    (property) =>
      property.status === "pending_review" ||
      getProvisionalDaysLeft(property) !== null
  ).length;

  const provisionalProperty = properties.find(
    (property) => getProvisionalDaysLeft(property) !== null
  );

  const expiredProperty = properties.find((property) =>
    isProvisionalExpired(property)
  );

  const provisionalDaysLeft = provisionalProperty
    ? getProvisionalDaysLeft(provisionalProperty)
    : null;

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

        {provisionalProperty && provisionalDaysLeft !== null && (
          <div className="mb-8 rounded-2xl border border-amber-700 bg-amber-950/40 p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                  Action needed
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  {provisionalDaysLeft}{" "}
                  {provisionalDaysLeft === 1 ? "day" : "days"} left to verify
                  &ldquo;{provisionalProperty.name}&rdquo;
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-200/80">
                  Your listing is live, but visitors see a Not Yet Verified
                  label. Provide proof that you own this property or are
                  authorized to advertise it before the time runs out, or it
                  will be taken down.
                </p>
              </div>

              <button
                onClick={() => router.push("/property-owners/verification")}
                className="w-full shrink-0 rounded-full bg-amber-500 px-6 py-3 font-semibold text-gray-950 transition hover:bg-amber-400 md:w-auto"
              >
                Verify now
              </button>
            </div>
          </div>
        )}

        {!provisionalProperty && expiredProperty && (
          <div className="mb-8 rounded-2xl border border-red-900 bg-red-950/40 p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-400">
                  Listing taken down
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  &ldquo;{expiredProperty.name}&rdquo; is no longer visible to
                  the public
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-red-200/80">
                  The 5-day period ended before proof of authorization was
                  provided. Submit the required proof to have your listing
                  reconsidered.
                </p>
              </div>

              <button
                onClick={() => router.push("/property-owners/verification")}
                className="w-full shrink-0 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 md:w-auto"
              >
                Submit proof
              </button>
            </div>
          </div>
        )}

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
              onClick={() =>
                router.push("/property-owners/list-property")
              }
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

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-2xl">
              🏠
            </div>

            <p className="mt-5 text-sm text-gray-400">
              My Properties
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              {loading ? "..." : totalProperties}
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
              {loading ? "..." : verifiedProperties}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Verified properties
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-2xl">
            
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Pending
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              {loading ? "..." : awaitingProperties}
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
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-800"
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

              <p className="mt-5 text-sm font-semibold text-green-500">
                Manage properties →
              </p>
            </button>

            <button
              onClick={() =>
                router.push("/property-owners/managers")
              }
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-800"
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

              <p className="mt-5 text-sm font-semibold text-green-500">
                Manage staff →
              </p>
            </button>

            <button
              onClick={() =>
                router.push("/property-owners/verification")
              }
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-800"
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

              <p className="mt-5 text-sm font-semibold text-green-500">
                View verification →
              </p>
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-white">
              Your Properties
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Properties you have submitted to MyKove.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-12 text-center">
              <p className="text-sm text-gray-400">
                Loading your properties...
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/70 px-6 py-12 text-center">
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
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {properties.map((property) => {
                const badge = getStatusBadge(property);
                const coverUrl = getPhotoUrl(property.cover_photo);

                return (
                  <div
                    key={property.id}
                    className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg"
                  >
                    <div className="aspect-[16/9] bg-gray-800">
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverUrl}
                          alt={property.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-600">
                          No cover photo
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            {property.name}
                          </h4>

                          <p className="mt-1 text-sm text-gray-400">
                            {property.location} · {property.type}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>
                          ₦{Number(property.price).toLocaleString()}{" "}
                          {property.price_period}
                        </span>

                        <span>
                          {property.units}{" "}
                          {property.units === 1 ? "unit" : "units"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
