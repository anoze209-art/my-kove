"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
type Property = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  location: string;
  price: number | null;
  status: string | null;
  created_at: string;
};

export default function ExplorePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stayType, setStayType] = useState("all");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState("recommended");
  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, name, type, description, location, price, status, created_at"
        )
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        setError("We couldn't load the properties right now.");
        setProperties([]);
      } else {
        setProperties(data ?? []);
      }
      setLoading(false);
    }

    loadProperties();
  }, []);
  const filteredProperties = useMemo(() => {
    let result = [...properties];
    const searchValue = search.trim().toLowerCase();
    if (searchValue) {
      result = result.filter(
        (property) =>
          property.name.toLowerCase().includes(searchValue) ||
          property.location.toLowerCase().includes(searchValue) ||
          property.type.toLowerCase().includes(searchValue)
      );
    }

    if (stayType !== "all") {
      result = result.filter(
        (property) =>
          property.type.toLowerCase() === stayType.toLowerCase()
      );
    }
    if (budget !== "all") {
      result = result.filter((property) => {
        const price = property.price ?? 0;
        if (budget === "under-500k") return price < 500000;
        if (budget === "500k-1m")
          return price >= 500000 && price <= 1000000;
        if (budget === "1m-2m")
          return price > 1000000 && price <= 2000000;
        if (budget === "2m-plus") return price > 2000000;
        return true;
      });
    }
    if (sort === "lowest") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (sort === "highest") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return result;
  }, [properties, search, stayType, budget, sort]);
  function formatPrice(price: number | null) {
    if (price === null) return "Price unavailable";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  }
  function getPeriod(type: string) {
    const normalizedType = type.toLowerCase();
    if (
      normalizedType.includes("hotel") ||
      normalizedType.includes("short")
    ) {
      return "/night";
    }
    return "/year";
  }
  function isAvailable(status: string | null) {
    if (!status) return true;
    const normalizedStatus = status.toLowerCase();
    return (
      normalizedStatus === "available" ||
      normalizedStatus === "active"
    );
  }
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            My<span className="text-green-600">Kove</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/explore"
              className="text-sm font-semibold text-green-600"
            >
              Explore
            </Link>
            <Link
              href="/#list"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              List Your Kove
            </Link>
            <Link
              href="/property-owners/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Sign In
            </Link>
            <Link
              href="/property-owners/sign-up"
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm md:hidden">
            Menu
          </button>
        </div>
      </nav>
      <section className="bg-gray-100 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-wide text-green-600">
            EXPLORE KOVES
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next stay.
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Browse hostels, apartments, and short stays around Abuja.
            Compare what matters before you make your decision.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location or property name..."
              className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-5 py-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <select
              value={stayType}
              onChange={(e) => setStayType(e.target.value)}
              className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3.5 outline-none focus:border-green-500"
            >
              <option value="all">All stay types</option>
              <option value="student hostel">Student Hostel</option>
              <option value="apartment">Apartment</option>
              <option value="short stay">Short Stay</option>
              <option value="hotel">Hotel</option>
            </select>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3.5 outline-none focus:border-green-500"
            >
              <option value="all">Any budget</option>
              <option value="under-500k">Under ₦500K</option>
              <option value="500k-1m">₦500K - ₦1M</option>
              <option value="1m-2m">₦1M - ₦2M</option>
              <option value="2m-plus">₦2M+</option>
            </select>
            <button
              onClick={() => {
                setSearch(search);
              }}
              className="rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white hover:bg-green-700"
            >
              Search
            </button>
          </div>
        </div>
      </section>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">
                Places to stay
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {loading
                  ? "Loading properties..."
                  : `${filteredProperties.length} ${
                      filteredProperties.length === 1
                        ? "property"
                        : "properties"
                    } found`}
              </p>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-500"
            >
              <option value="recommended">Recommended</option>
              <option value="lowest">Lowest price</option>
              <option value="highest">Highest price</option>
            </select>
          </div>
          {loading && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                Loading available properties...
              </p>
            </div>
          )}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Unable to load properties
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>
            </div>
          )}
          {!loading && !error && filteredProperties.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                No properties found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <article
                  key={property.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-56 items-center justify-center bg-gray-200">
                    <div className="text-4xl font-bold text-gray-400">
                      MyKove
                    </div>
                    <div className="absolute left-4 top-4">
                      {isAvailable(property.status) ? (
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
                          {property.status || "Unavailable"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {property.type}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold">
                      {property.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {property.location}
                    </p>

                    {property.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {property.description}
                      </p>
                    )}
                    <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                      <div>
                        <span className="text-lg font-bold">
                          {formatPrice(property.price)}
                        </span>

                        <span className="text-sm text-gray-500">
                          {property.price !== null &&
                            getPeriod(property.type)}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="border-t border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-gray-900"
            >
              My<span className="text-green-600">Kove</span>
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              One Place For Every Kove.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 MyKove. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
