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
              className="text-sm font-medium text-gray-400 transition hover:text-white"
            >
              Back to MyKove
            </Link>

            <Link
              href="/sign-in"
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
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

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Put your property in front of the right people.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              List, manage, and grow your properties with MyKove. Whether you
              own a property or manage one on behalf of someone else, this is
              your space to take control.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-full bg-green-600 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-green-500"
              >
                Get Started
              </Link>

              <Link
                href="/sign-in"
                className="rounded-full border border-gray-700 bg-gray-900 px-7 py-3.5 text-center font-semibold text-gray-200 transition hover:bg-gray-800"
              >
                I Already Have an Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-900 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-green-500">
              YOUR PROPERTY HUB
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Everything you need in one place.
            </h2>

            <p className="mt-4 text-gray-400">
              MyKove will give property owners and managers the tools to
              showcase and manage their spaces without unnecessary stress.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Add Property */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7 transition hover:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                🏠
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Add Your Properties
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Create detailed listings with photos, location, pricing,
                facilities, and other important information.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7 transition hover:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                ⚙️
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Manage Your Spaces
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Keep your listings updated and manage the information people
                see when they discover your property.
              </p>
            </div>

            {/* Staff */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-7 transition hover:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                👥
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Work With Your Team
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Give trusted managers or staff the appropriate access to help
                manage your properties.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-950 px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-800 bg-gray-900 p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-green-500">
              BUILDING TRUST
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Verified properties stand out.
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              MyKove will introduce a verification system designed to help
              users feel more confident about the properties they discover.
              Verification will be based on our own checks, not simply on
              someone claiming ownership.
            </p>

            <Link
              href="/sign-up"
              className="mt-7 inline-block rounded-full bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-500"
            >
              Start With MyKove
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-800 bg-gray-900 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Have a property to list?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Get your property onto MyKove and make it easier for the right
            people to find it.
          </p>

          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-full bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-500"
          >
            Get Started
          </Link>
        </div>
      </section>
      <footer className="border-t border-gray-800 bg-gray-950 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link href="/" className="text-xl font-bold">
            My<span className="text-green-500">Kove</span>
          </Link>

          <p className="text-sm text-gray-500">
            One Place For Every Kove.
          </p>
        </div>
      </footer>
    </main>
  );
}
