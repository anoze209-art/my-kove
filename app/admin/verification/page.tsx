import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import VerificationReview from "./review";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            My<span className="text-green-500">Kove</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-green-900 bg-green-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-400">
              Administrator
            </span>

            <Link
              href="/admin"
              className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Back to admin
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500">
          Owner authorization
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Verification requests
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Review the documents each owner submitted. Approving a request
          verifies that one property only.
        </p>

        <div className="mt-8">
          <VerificationReview />
        </div>
      </section>
    </main>
  );
}
