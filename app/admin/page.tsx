import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (error || profile?.role !== "admin") {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">MyKove Admin</h1>
        <p className="mt-2 text-gray-400">
          Manage properties, owners, and verification.
        </p>
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-gray-400">
            You have administrator access.
          </p>
        </div>
      </div>
    </main>
  );
}
