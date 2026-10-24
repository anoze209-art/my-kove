"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  location: string;
  address: string | null;
  price: number | null;
  price_period: string | null;
  status: string | null;
  verified: boolean | null;
  photos: string[] | null;
  cover_photo: string | null;
  facilities: string[] | null;
  created_at: string;
};

const PHOTO_BUCKET = "property photo";

const propertyTypes = [
  "Hostel",
  "Apartment",
  "Short Stay",
  "House",
  "Duplex",
  "Hotel",
  "Other",
];

function formatPrice(price: number | null) {
  if (price === null) return "Price unavailable";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatPricePeriod(period: string | null) {
  if (!period || period === "negotiable") return "";
  return ` ${period.replace(/^per\s+/i, "/")}`;
}

function getPhotoUrl(path: string | null) {
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) return path;

  const { data } = supabase.storage
    .from(PHOTO_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export default function ExplorePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [stayType, setStayType] = useState("all");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [menuOpen, setMenuOpen] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("properties")
        .select(
          "id, name, type, description, location, address, price, price_period, status, verified, photos, cover_photo, facilities, created_at"
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (queryError) {
        console.error("Explore properties error:", queryError);
        setError("We couldn't load properties right now. Please try again.");
        setProperties([]);
      } else {
        setProperties((data ?? []) as Property[]);
      }
    } catch (err) {
      console.error("Explore properties error:", err);
      setError("We couldn't load properties right now. Please try again.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];
    const searchValue = normalize(search);

    if (searchValue) {
      result = result.filter((property) =>
        [
          property.name,
          property.location,
          property.address,
          property.type,
          property.description,
          ...(property.facilities ?? []),
        ].some((value) => normalize(value).includes(searchValue))
      );
    }

    if (stayType !== "all") {
      result = result.filter(
        (property) => normalize(property.type) === normalize(stayType)
      );
    }

    if (budget !== "all") {
      result = result.filter((property) => {
        if (property.price === null) return false;

        const price = property.price;

        switch (budget) {
          case "under-500k":
            return price < 500000;
          case "500k-1m":
            return price >= 500000 && price <= 1000000;
          case "1m-2m":
            return price > 1000000 && price <= 2000000;
          case "2m-plus":
            return price > 2000000;
          default:
            return true;
        }
      });
    }

    if (sort === "lowest") {
      result.sort(
        (a, b) =>
          (a.price ?? Number.MAX_SAFE_INTEGER) -
          (b.price ?? Number.MAX_SAFE_INTEGER)
      );
    } else if (sort === "highest") {
      result.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    }

    return result;
  }, [properties, search, stayType, budget, sort]);

  function resetFilters() {
    setSearch("");
    setSearchInput("");
    setStayType("all");
    setBudget("all");
    setSort("recommended");
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/"
            aria-label="MyKove homepage"
            className="text-2xl font-bold tracking-tight"
          >
            My<span className="text-green-600">Kove</span>
          </Link>

          <div className="hidden items-center md:flex">
            <Link
              href="/property-owners"
              className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              List Your Kove
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
            <Link
              href="/property-owners"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
            >
              List Your Kove
            </Link>
          </div>
        )}
      </nav>

      <section className="border-b border-gray-200 bg-gray-100 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Find your place
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            A better place to find your next stay.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Explore hostels, apartments, and short stays. Compare prices,
            facilities, and locations before making your decision.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput);
            }}
            className="mt-8 grid gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]"
          >
            <label className="sm:col-span-2 lg:col-span-1">
              <span className="sr-only">Search properties</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name, area, or facility..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label>
              <span className="sr-only">Property type</span>
              <select
                value={stayType}
                onChange={(event) => setStayType(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="all">All property types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="sr-only">Budget</span>
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="all">Any budget</option>
                <option value="under-500k">Under ₦500K</option>
                <option value="500k-1m">₦500K–₦1M</option>
                <option value="1m-2m">₦1M–₦2M</option>
                <option value="2m-plus">₦2M+</option>
              </select>
            </label>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="bg-gray-100 px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                Explore MyKove
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Places to stay
              </h2>

              <p className="mt-2 text-sm text-gray-500" aria-live="polite">
                {loading
                  ? "Finding available properties..."
                  : `${filteredProperties.length} ${
                      filteredProperties.length === 1
                        ? "property"
                        : "properties"
                    } found`}
              </p>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-600">
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="recommended">Newest first</option>
                <option value="lowest">Lowest price</option>
                <option value="highest">Highest price</option>
              </select>
            </label>
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-gray-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">
                Properties could not be loaded
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadProperties()}
                className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredProperties.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                No properties found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Try a different search or adjust your filters. New listings
                will appear here once they have been approved.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700"
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => {
                const imagePath =
                  property.cover_photo || property.photos?.[0] || null;
                const imageUrl = getPhotoUrl(imagePath);

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                  >
                    <Link
                      href={`/explore/${property.id}`}
                      aria-label={`View ${property.name}`}
                      className="relative block aspect-[4/3] overflow-hidden bg-gray-100"
                    >
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={property.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                          No property photo available
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {property.verified === true && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.415 0l-3.6-3.6a1 1 0 011.414-1.42l2.893 2.894 6.493-6.494a1 1 0 011.415 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </span>
                        )}

                        {property.verified !== true && (
                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                            Not verified
                          </span>
                        )}
                      </div>

                      <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
                        {property.type}
                      </span>
                    </Link>

                    <div className="p-5">
                      <h3 className="truncate text-lg font-bold tracking-tight text-gray-900">
                        {property.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {property.location}
                      </p>

                      {property.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                          {property.description}
                        </p>
                      )}

                      {property.facilities &&
                        property.facilities.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {property.facilities.slice(0, 3).map((facility) => (
                              <span
                                key={facility}
                                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                              >
                                {facility}
                              </span>
                            ))}

                            {property.facilities.length > 3 && (
                              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                                +{property.facilities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="min-w-0">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(property.price)}
                          </p>

                          {property.price !== null &&
                            property.price_period && (
                              <p className="mt-0.5 text-xs text-gray-500">
                                {formatPricePeriod(property.price_period)}
                              </p>
                            )}
                        </div>

                        <Link
                          href={`/explore/${property.id}`}
                          className="shrink-0 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              My<span className="text-green-600">Kove</span>
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              One Place For Every Stay.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MyKove. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

