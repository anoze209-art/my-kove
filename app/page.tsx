"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">

      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            My<span className="text-green-500">Kove</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-gray-300 hover:text-green-400"
            >
              Explore
            </Link>

            <Link
              href="/property-owners"
              className="text-sm font-medium text-gray-300 hover:text-green-400"
            >
              For Property Owners
            </Link>

            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-300 hover:text-green-400"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
            >
              Get Started
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/owner"
              className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200"
            >
              List Property
            </Link>

            <Link
              href="/sign-in"
              className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-gray-800 bg-gray-950 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
              ONE PLACE FOR EVERY KOVE
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find a place that feels like{" "}
              <span className="text-green-500">Kove.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Discover hostels, apartments, and short stays in one place.
              Search by location, budget, and the type of space you need.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-500"
              >
                Explore Koves
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full border border-gray-700 bg-gray-900 px-8 py-4 font-semibold text-gray-200 hover:bg-gray-800"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-4xl">
            <Link
              href="/owner"
              className="group block rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:border-green-700"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
                    Have a property?
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    List and manage your property on MyKove.
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Give your property visibility and manage your listings
                    from one place.
                  </p>
                </div>

                <div className="shrink-0 rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-200 group-hover:border-green-600 group-hover:text-green-400">
                  For Property Owners →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5 shadow-xl">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-gray-500">
                  LOCATION
                </label>

                <input
                  type="text"
                  placeholder="Location or property..."
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-gray-500">
                  TYPE
                </label>

                <select className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-green-500">
                  <option>Any type</option>
                  <option>Hostel</option>
                  <option>Apartment</option>
                  <option>Short Stay</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wide text-gray-500">
                  BUDGET
                </label>

                <select className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-green-500">
                  <option>Any budget</option>
                  <option>Under ₦100,000</option>
                  <option>₦100,000 - ₦300,000</option>
                  <option>₦300,000+</option>
                </select>
              </div>

              <div className="flex items-end">
                <Link
                  href="/explore"
                  className="w-full rounded-xl bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-500"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-green-500">
              FIND YOUR SPACE
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              What are you looking for?
            </h2>

            <p className="mt-3 text-gray-400">
              Explore different types of accommodation available on MyKove.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/explore?type=hostel"
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-8 hover:-translate-y-1 hover:border-green-700 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-950 text-2xl">
                🏠
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">Hostels</h3>

              <p className="mt-3 text-gray-400">
                Find student-friendly hostels close to your school and
                everything you need.
              </p>

              <p className="mt-5 font-semibold text-green-500">
                Explore hostels →
              </p>
            </Link>

            <Link
              href="/explore?type=apartment"
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-8 hover:-translate-y-1 hover:border-green-700 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-950 text-2xl">
                🏢
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Apartments
              </h3>

              <p className="mt-3 text-gray-400">
                Discover apartments that give you the comfort and space you
                need.
              </p>

              <p className="mt-5 font-semibold text-green-500">
                Explore apartments →
              </p>
            </Link>

            <Link
              href="/explore?type=short-stay"
              className="group rounded-2xl border border-gray-800 bg-gray-900 p-8 hover:-translate-y-1 hover:border-green-700 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-950 text-2xl">
                🛏️
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Short Stays
              </h3>

              <p className="mt-3 text-gray-400">
                Need somewhere for a few nights? Find comfortable short-stay
                spaces.
              </p>

              <p className="mt-5 font-semibold text-green-500">
                Explore short stays →
              </p>
            </Link>
          </div>
        </div>
      </section>
      <section className="border-y border-gray-800 bg-gray-900 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-500">
              SIMPLE & EASY
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Find your Kove in 3 steps
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">Search</h3>

              <p className="mt-3 text-gray-400">
                Tell us where you want to stay and what kind of space you
                need.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">Explore</h3>

              <p className="mt-3 text-gray-400">
                Browse available Koves and compare their details, prices,
                locations, and features.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Get Your Kove
              </h3>

              <p className="mt-3 text-gray-400">
                Choose the space that works for you and take the next step
                toward your new Kove.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 px-8 py-14 sm:px-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-green-500">
                  FOR PROPERTY OWNERS
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Have a space to list?
                </h2>

                <p className="mt-4 text-gray-400">
                  Put your property in front of people actively looking for a
                  place. Create listings, manage your properties, and keep
                  everything organized.
                </p>
              </div>

              <Link
                href="/owner"
                className="shrink-0 rounded-full bg-green-600 px-7 py-3.5 text-center font-semibold text-white hover:bg-green-500"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-green-700 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to find your Kove?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-green-100">
            Start exploring hostels, apartments, and short stays around you.
          </p>

          <Link
            href="/explore"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-green-800 hover:bg-gray-100"
          >
            Explore Now
          </Link>
        </div>
      </section>
      <footer className="border-t border-gray-800 bg-gray-950 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              My<span className="text-green-500">Kove</span>
            </Link>

            <p className="mt-2 text-sm text-gray-500">
              One Place For Every Kove.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <Link href="/explore" className="hover:text-green-400">
              Explore
            </Link>

            <Link href="/owner" className="hover:text-green-400">
              Property Owners
            </Link>

            <Link href="/sign-in" className="hover:text-green-400">
              Sign In
            </Link>

            <Link href="/sign-up" className="hover:text-green-400">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} MyKove. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
