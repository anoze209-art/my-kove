"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type OwnerVerificationRecord = {
  full_name: string;
  phone: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: string;
  rejection_reason: string | null;
  submitted_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function VerifyIdentity() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [ownerVerified, setOwnerVerified] = useState(false);
  const [record, setRecord] = useState<OwnerVerificationRecord | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/property-owners/sign-in");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("owner_verified")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setOwnerVerified(profile?.owner_verified === true);

      const { data: existing, error: recordError } = await supabase
        .from("owner_verifications")
        .select(
          "full_name, phone, address, emergency_contact_name, emergency_contact_phone, status, rejection_reason, submitted_at"
        )
        .eq("owner_id", user.id)
        .maybeSingle();

      if (recordError) {
        throw recordError;
      }

      if (existing) {
        const loaded = existing as OwnerVerificationRecord;
        setRecord(loaded);
        setFullName(loaded.full_name);
        setPhone(loaded.phone);
        setAddress(loaded.address);
        setEmergencyName(loaded.emergency_contact_name);
        setEmergencyPhone(loaded.emergency_contact_phone);
      } else {
        setRecord(null);
      }
    } catch (err) {
      console.error("Identity verification page error:", err);
      setError("Could not load your details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError("Please confirm that your details are correct.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be signed in to submit your details.");
      }

      const details = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        emergency_contact_name: emergencyName.trim(),
        emergency_contact_phone: emergencyPhone.trim(),
        status: "pending",
        rejection_reason: null,
        reviewed_by: null,
        reviewed_at: null,
        submitted_at: new Date().toISOString(),
      };

      if (record) {
        const { error: updateError } = await supabase
          .from("owner_verifications")
          .update(details)
          .eq("owner_id", user.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("owner_verifications")
          .insert({ owner_id: user.id, ...details });

        if (insertError) {
          throw insertError;
        }
      }

      setConsent(false);

      await loadData();
    } catch (err) {
      console.error("Identity verification submit error:", err);

      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Something went wrong while submitting your details.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const isPending = record?.status === "pending";
  const isRejected = record?.status === "rejected";
  const showForm = !ownerVerified && !isPending;

  const inputClass =
    "w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500";
  const labelClass = "mb-2 block text-sm font-medium text-gray-300";
  const cardClass =
    "rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8";

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              My<span className="text-green-500">Kove</span>
            </h1>

            <p className="text-xs text-gray-400">
              Property Owners
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/property-owners/dashboard")}
            className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-500">
            OWNER VERIFICATION
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Verify who you are
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Tell us about yourself so that people can trust the listings you
            post. Until you are verified, your listing shows a warning and
            stays online for 5 days only.
          </p>
        </div>

        {loading ? (
          <div className={`${cardClass} text-center`}>
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ownerVerified && (
              <div className="rounded-2xl border border-green-900 bg-green-950/30 p-6">
                <h3 className="text-lg font-bold text-white">
                  You are verified
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-200/70">
                  Your listings no longer show the owner warning, and you can
                  list as many properties as you like. Verifying each property
                  is a separate step that earns the green Verified badge.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/property-owners/dashboard")}
                  className="mt-5 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
                >
                  Go to dashboard
                </button>
              </div>
            )}

            {isPending && record && !ownerVerified && (
              <div className="rounded-2xl border border-amber-800 bg-amber-950/30 p-6">
                <h3 className="text-lg font-bold text-white">
                  Your details are under review
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-200/80">
                  We received your details on {formatDate(record.submitted_at)}.
                  This page will update once the review is done.
                </p>
              </div>
            )}

            {isRejected && record && !ownerVerified && (
              <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6">
                <h3 className="text-lg font-bold text-white">
                  Your details were not approved
                </h3>

                {record.rejection_reason && (
                  <p className="mt-2 text-sm leading-6 text-red-200/80">
                    {record.rejection_reason}
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-red-200/80">
                  Correct them below and submit again.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-900 bg-red-950 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className={cardClass}>
                <h3 className="text-xl font-bold text-white">
                  Your details
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  These details are private. Only the MyKove team can see them.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className={labelClass}>
                      Full legal name
                    </label>

                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={120}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name as it appears on your official ID"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone number
                    </label>

                    <input
                      type="tel"
                      required
                      minLength={7}
                      maxLength={20}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="A number we can reach you on"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Residential address
                    </label>

                    <input
                      type="text"
                      required
                      minLength={10}
                      maxLength={250}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Where you live, not the address of the property"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Emergency contact name
                      </label>

                      <input
                        type="text"
                        required
                        minLength={3}
                        maxLength={120}
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="A relative or close friend"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Emergency contact phone
                      </label>

                      <input
                        type="tel"
                        required
                        minLength={7}
                        maxLength={20}
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="Their phone number"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <label className="flex cursor-pointer gap-3 rounded-xl border border-gray-700 bg-gray-950 p-4">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 accent-green-500"
                    />

                    <span className="text-sm leading-6 text-gray-400">
                      I confirm that these details are correct, and I agree
                      that MyKove may use them to verify my identity and to
                      contact me, or my emergency contact, if there is a
                      problem with my listings.
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit for review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
