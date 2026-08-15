const properties = [
  {
    name: "Lake Side Apartments",
    type: "Apartment",
    location: "Abuja, Nigeria",
    price: "₦2,500,000",
    period: "/year",
    rating: "4.8",
    reviews: 32,
    verified: true,
    available: true,
    image: "🏢",
  },
  {
    name: "Forte Lugard Apartments 1",
    type: "Apartment",
    location: "Abuja, Nigeria",
    price: "₦2,500,000",
    period: "/year",
    rating: "4.6",
    reviews: 18,
    verified: true,
    available: true,
    image: "🏢",
  },
  {
    name: "Forte Lugard Apartments 2",
    type: "Apartment",
    location: "Abuja, Nigeria",
    price: "₦2,500,000",
    period: "/year",
    rating: "4.7",
    reviews: 24,
    verified: true,
    available: true,
    image: "🏢",
  },
];

import { Coming_Soon } from "next/font/google";
import Link from "next/link";
export default function ExplorePage() {
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
            <a
              href="/explore"
              className="text-sm font-semibold text-green-600"
            >
              Explore
            </a>
            <a
              href="/#list"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              List Your Kove
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Sign In
            </a>
            <button className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              Get Started
            </button>
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
              placeholder="Search by location or property name..."
              className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-5 py-3.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
            <select
              defaultValue="all"
              className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3.5 outline-none focus:border-green-500"
            >
              <option value="all">All stay types</option>
              <option>Student Hostel</option>
              <option>Apartment</option>
              <option>Short Stay</option>
            </select>
            <select
              defaultValue="all"
              className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3.5 outline-none focus:border-green-500"
            >
              <option value="all">Any budget</option>
              <option>Under ₦500K</option>
              <option>₦500K - ₦1M</option>
              <option>₦1M - ₦2M</option>
              <option>₦2M+</option>
            </select>
            <button className="rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white hover:bg-green-700">
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
                {properties.length} properties found
              </p>
            </div>

            <select
              defaultValue="recommended"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-500"
            >
              <option value="recommended">Recommended</option>
              <option>Highest rated</option>
              <option>Lowest price</option>
              <option>Highest price</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <article
                key={property.name}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-56 items-center justify-center bg-gray-200 text-6xl">

                  {property.image}
                  <div className="absolute left-4 top-4">
                    {property.available ? (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
                        Fully Booked
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {property.type}
                    </span>
                    {property.verified && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-bold">
                    {property.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    📍 {property.location}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-semibold">
                      ★ {property.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({property.reviews} reviews)
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-lg font-bold">
                        {property.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {property.period}
                      </span>
                    </div>
                    <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600">
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900">
              My<span className="text-green-600">Kove</span>
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              One Place For Every Stay.
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