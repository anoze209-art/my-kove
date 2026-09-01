"use client";

import Link from "next/link";

export default function PropertyOwners() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold text-white">
            My<span className="text-green-500">Kove</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-300 transition hover:text-green-400"
          >
            Back to MyKove
          </Link>
        </div>
      </nav>

      <section className="border-b border-gray-800 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
            FOR PROPERTY OWNERS & MANAGERS
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Put your property in front of the right people.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            List, manage, and grow your properties on MyKove. Whether you own
            one property or manage several, MyKove gives you one place to
            handle them.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/property-owners/sign-up"
              className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-500"
            >
              Get Started
            </Link>

            <Link
              href="/property-owners/sign-in"
              className="rounded-full border border-gray-700 bg-gray-900 px-8 py-4 font-semibold text-gray-200 transition hover:border-gray-600 hover:bg-gray-800"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
              YOUR PROPERTY, YOUR CONTROL
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Everything you need to manage your properties.
            </h2>

            <p className="mt-4 text-gray-400">
              MyKove is designed to make property management simpler, whether
              you're an owner, landlord, or someone managing properties on
              behalf of an owner.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-7">
              <div className="text-3xl">🏠</div>

              <h3 className="mt-5 text-xl font-bold text-white">
                List Properties
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Add your properties to MyKove and make them easier for people
                to discover.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-7">
              <div className="text-3xl">📊</div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Manage Your Listings
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Keep your property information, availability, images, and
                other details up to date.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-7">
              <div className="text-3xl">👥</div>

              <h3 className="mt-5 text-xl font-bold text-white">
                Work With Your Team
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Property owners can eventually give trusted managers or staff
                access to help manage their properties.
              </p>
            </div>
          </div>
        </div>
      </section>

   
      <section className="border-y border-gray-800 bg-gray-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8 sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-500">
              BUILT FOR REAL PROPERTY OPERATIONS
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
              Own it. Manage it. MyKove handles the platform.
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-gray-400">
              You don't have to personally manage every part of your property.
              MyKove is being built to support owners, landlords, property
              managers, supervisors, and trusted staff while keeping the right
              controls in the right hands.
            </p>

            <div className="mt-8">
              <Link
                href="/property-owners/sign-up"
                className="inline-block rounded-full bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-500"
              >
                Create Owner Account
              </Link>
            </div>
          </div>
        </div>
      </section>

  
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to put your property on MyKove?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Create your property account and start building your presence on
            MyKove.
          </p>

          <Link
            href="/property-owners/sign-up"
            className="mt-8 inline-block rounded-full bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-500"
          >
            Get Started
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} MyKove. All rights reserved.</p>

          <Link
            href="/"
            className="transition hover:text-green-400"
          >
            Back to MyKove
          </Link>
        </div>
      </footer>
    </main>
  );
}
