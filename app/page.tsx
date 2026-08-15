"use client";
import Link from "next/link";
export default function Home() {
  return (

    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            My<span className="text-green-600">Kove</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Explore
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
          <Link
            href="/sign-in"
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Sign In
          </Link>
        </div>
      </nav>
      <section className="bg-gray-100 px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-green-600">
            ONE PLACE FOR EVERY KOVE
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
            Find your next stay.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Discover hostels, apartments, and short stays in one place.
            Find a space that fits your needs, location, and budget.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/explore"
              className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
            >
              Explore Koves
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-white p-4 shadow-lg">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-500">
                  LOCATION
                </label>
                <input
                  type="text"
                  placeholder="Search by location or property name..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-500">
                  TYPE
                </label>
                <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600">
                  <option>Any type</option>
                  <option>Hostel</option>
                  <option>Apartment</option>
                  <option>Short Stay</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-500">
                  BUDGET
                </label>
                <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600">
                  <option>Any budget</option>
                  <option>Under ₦100,000</option>
                  <option>₦100,000 - ₦300,000</option>
                  <option>₦300,000+</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link
                  href="/explore"
                  className="w-full rounded-xl bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-700"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600">
              FIND YOUR SPACE
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              What are you looking for?
            </h2>
            <p className="mt-3 text-gray-600">
              Explore different types of accommodation available on MyKove.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/explore?type=hostel"
              className="group rounded-2xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🏠
              </div>
              <h3 className="mt-6 text-xl font-bold">Hostels</h3>
              <p className="mt-3 text-gray-600">
                Find student-friendly hostels close to your school and
                everything you need.
              </p>
              <p className="mt-5 font-semibold text-green-600 group-hover:underline">
                Explore hostels →
              </p>
            </Link>
            <Link
              href="/explore?type=apartment"
              className="group rounded-2xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🏢
              </div>
              <h3 className="mt-6 text-xl font-bold">Apartments</h3>
              <p className="mt-3 text-gray-600">
                Discover apartments that give you the comfort and space you
                need.
              </p>
              <p className="mt-5 font-semibold text-green-600 group-hover:underline">
                Explore apartments →
              </p>
            </Link>
            <Link
              href="/explore?type=short-stay"
              className="group rounded-2xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🛏️
              </div>
              <h3 className="mt-6 text-xl font-bold">Short Stays</h3>
              <p className="mt-3 text-gray-600">
                Need somewhere for a few nights? Find comfortable short-stay
                spaces.
              </p>
              <p className="mt-5 font-semibold text-green-600 group-hover:underline">
                Explore short stays →
              </p>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600">
              SIMPLE & EASY
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Find your Kove in 3 steps
            </h2>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mt-5 text-xl font-bold">Search</h3>
              <p className="mt-3 text-gray-600">
                Tell us where you want to stay and what kind of space you
                need.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mt-5 text-xl font-bold">Explore</h3>
              <p className="mt-3 text-gray-600">
                Browse available Koves and compare their details, prices,
                locations, and features.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mt-5 text-xl font-bold">Get Your Kove</h3>
              <p className="mt-3 text-gray-600">
                Choose the space that works for you and take the next step
                toward your new Kove.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-green-600 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to find your Kove?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-green-50">
            Start exploring hostels, apartments, and short stays around you.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-green-700 transition hover:bg-gray-100"
          >
            Explore Now
          </Link>
        </div>
      </section>
      <footer className="border-t bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link href="/" className="text-2xl font-bold">
              My<span className="text-green-600">Kove</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              One Place For Every Kove.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/explore" className="hover:text-green-600">
              Explore
            </Link>
            <Link href="/sign-in" className="hover:text-green-600">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-green-600">
              Sign Up
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} MyKove. All rights reserved.
        </div>
      </footer>
    </main>
  );
}