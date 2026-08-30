"use client";

import Link from "next/link";

export default function PropertyOwners() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            My<span className="text-green-500">Kove</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden text-sm font-medium text-gray-400 transition hover:text-white sm:block"
            >
              Back to MyKove
            </Link>

            <Link
              href="/sign-in"
              className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-900"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-gray-800 bg-gray-950 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
              FOR PROPERTY OWNERS & MANAGERS
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Put your property where people are already looking.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              List your properties on MyKove, reach people looking for a place
              to stay, and manage your properties from one simple dashboard.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-full bg-green-600 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-green-700"
              >
                Get Started
              </Link>

              <Link
                href="/sign-in"
                className="rounded-full border border-gray-700 px-7 py-3.5 text-center font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-900"
              >
                I Already Have an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-900 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
              YOUR PROPERTY, YOUR CONTROL
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Everything you need to manage your Koves.
            </h2>

            <p className="mt-4 text-gray-400">
              Whether you own one property or manage several, MyKove is built
              to make the process easier.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                🏠
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Add Properties
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Add your hostels, apartments, short-stay spaces, or other
                properties and keep their information organized.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                📊
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Manage Your Listings
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Update property details, availability, pricing, photos, and
                other information from your dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                👥
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Work With Your Team
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Property owners will be able to give trusted managers or staff
                limited access to help manage their properties.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Get your property on MyKove.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                1
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Create an Account
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Create your MyKove account and enter the property management
                area.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                2
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Add Your Property
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Provide the property details, location, pricing, photos, and
                other information.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                3
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Get Discovered
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Once reviewed and approved, your property can become visible
                to people searching for their next Kove.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-green-500/20 bg-green-500/10 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to put your property on MyKove?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Create your account and start building your property presence on
            MyKove.
          </p>

          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-full bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            Get Started
          </Link>
        </div>
      </section>
      <footer className="border-t border-gray-800 bg-gray-950 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              My<span className="text-green-500">Kove</span>
            </Link>

            <p className="mt-2 text-sm text-gray-500">
              One Place For Every Kove.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/explore" className="transition hover:text-white">
              Explore
            </Link>

            <Link href="/sign-in" className="transition hover:text-white">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-6 text-sm text-gray-600">
          © {new Date().getFullYear()} MyKove. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
