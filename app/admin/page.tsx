import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold tracking-tight text-white">
            My<span className="text-green-500">Kove</span>
          </a>
          <span className="rounded-full border border-green-900 bg-green-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-400">
            Administrator
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
          Platform management
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Admin dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
          Manage MyKove listings, owners, verification, and reports from one place.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">
            Security setup in progress
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            Administrator access is checked on the server for this page. Before
            enabling management actions or platform-wide statistics, the database
            policies must also be updated and tested so administrators have the
            required access without giving ordinary users extra permissions.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Properties",
              description: "Review listing status and manage published properties.",
            },
            {
              title: "Owner authorization",
              description: "Review evidence that an advertiser is authorized to list a property.",
            },
            {
              title: "Property verification",
              description: "Track inspection requests and properties that pass verification.",
            },
            {
              title: "Reports and complaints",
              description: "Review reported listings and unresolved safety concerns.",
            },
            {
              title: "Subscriptions",
              description: "Prepare listing plans, free periods, and renewals.",
            },
            {
              title: "Activity log",
              description: "Keep a record of important administrator actions.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-5"
            >
              <h2 className="font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {item.description}
              </p>
              <span className="mt-4 inline-flex rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-500">
                Planned
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
