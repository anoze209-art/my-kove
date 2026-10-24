"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Property = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  location: string;
  address: string | null;
  price: number | null;
  price_period: string | null;
  status: string | null;
  verified: boolean | null;
  authorization_status: string | null;
  provisional_expires_at: string | null;
  photos: string[] | null;
  cover_photo: string | null;
  facilities: string[] | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  instagram: string | null;
  tiktok: string | null;
  whatsapp: string | null;
  other_social: string | null;
  created_at: string;
};

const PHOTO_BUCKET = "property photo";

const reportReasons = [
  "Suspicious or likely scam",
  "Incorrect or misleading information",
  "Photos do not match the property",
  "Already rented or unavailable",
  "Inappropriate content",
  "Other",
];

function formatPrice(price: number | null) {
  if (price === null) return "Price unavailable";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatPricePeriod(period: string | null) {
  if (!period || period === "negotiable") return "";
  return ` ${period.replace(/^per\s+/i, "/")}`;
}

function getPhotoUrl(path: string | null) {
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) return path;

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);

  return data.publicUrl;
}

function getProvisionalDaysLeft(property: Property) {
  if (
    property.authorization_status !== "not_submitted" ||
    !property.provisional_expires_at
  ) {
    return null;
  }

  const msLeft =
    new Date(property.provisional_expires_at).getTime() - Date.now();

  if (msLeft <= 0) return null;

  return Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(reportReasons[0]);
  const [reportDetails, setReportDetails] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportDone, setReportDone] = useState(false);
  const [reportError, setReportError] = useState("");

  const loadProperty = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("properties")
      .select(
        "id, name, type, description, location, address, price, price_period, status, verified, authorization_status, provisional_expires_at, photos, cover_photo, facilities, contact_name, contact_phone, contact_email, instagram, tiktok, whatsapp, other_social, created_at"
      )
      .eq("id", propertyId)
      .maybeSingle();

    if (queryError || !data) {
      setError("This property could not be found.");
      setProperty(null);
    } else {
      setProperty(data as Property);
      setActivePhoto(data.cover_photo || data.photos?.[0] || null);
    }

    setLoading(false);
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) void loadProperty();
  }, [propertyId, loadProperty]);

  async function submitReport() {
    setReportLoading(true);
    setReportError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to report a listing.");
      }

      const { error: reportError } = await supabase.from("reports").insert({
        property_id: propertyId,
        reporter_id: user.id,
        reason: reportReason,
        details: reportDetails.trim() || null,
      });

      if (reportError) {
        throw reportError;
      }

      setReportDone(true);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Something went wrong submitting your report.";
      setReportError(message);
    } finally {
      setReportLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-100">
        <p className="text-gray-400">Loading property...</p>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 px-6 text-center text-gray-100">
        <p className="text-lg font-semibold">{error || "Property not found."}</p>
        <Link
          href="/explore"
          className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
        >
          Back to Explore
        </Link>
      </main>
    );
  }

  const photoUrls = (property.photos ?? []).map((path) => getPhotoUrl(path));
  const activeUrl = getPhotoUrl(activePhoto);
  const provisionalDaysLeft = getProvisionalDaysLeft(property);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            My<span className="text-green-500">Kove</span>
          </Link>

          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="rounded-full border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-green-500 hover:text-green-400"
          >
            ← Back to Explore
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-8 sm:py-12">
        {provisionalDaysLeft !== null && (
          <div className="mb-6 rounded-2xl border border-amber-700 bg-amber-950/40 p-4">
            <p className="text-sm font-semibold text-amber-400">
              Not Yet Verified
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-200/80">
              This owner has not yet completed MyKove&apos;s authorization
              check. This listing will be taken down in {provisionalDaysLeft}{" "}
              {provisionalDaysLeft === 1 ? "day" : "days"} unless that is
              completed. Please take extra care before making any payment.
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900">
          <div className="aspect-[16/9] w-full bg-gray-950">
            {activeUrl ? (
            
              <img
                src={activeUrl}
                alt={property.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600">
                No photo available
              </div>
            )}
          </div>

          {photoUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto border-t border-gray-800 bg-gray-950 p-4">
              {(property.photos ?? []).map((path, index) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => setActivePhoto(path)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activePhoto === path
                      ? "border-green-500"
                      : "border-gray-800"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrls[index] ?? ""}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {property.name}
            </h1>
            <p className="mt-2 text-gray-400">
              {property.location}
              {property.type ? ` · ${property.type}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {property.verified === true && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
                Verified
              </span>
            )}

            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="rounded-full border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-red-500 hover:text-red-400"
            >
              Report listing
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-full bg-green-950 px-4 py-2 text-sm font-semibold text-green-400 w-fit">
          {formatPrice(property.price)}
          {formatPricePeriod(property.price_period)}
        </div>

        {property.address && (
          <p className="mt-5 text-sm text-gray-400">{property.address}</p>
        )}

        {property.description && (
          <div className="mt-7">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              About this property
            </h2>
            <p className="mt-2 whitespace-pre-line leading-7 text-gray-300">
              {property.description}
            </p>
          </div>
        )}

        {property.facilities && property.facilities.length > 0 && (
          <div className="mt-7">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Facilities & Amenities
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.facilities.map((facility) => (
                <span
                  key={facility}
                  className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-300"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {(property.contact_name ||
          property.contact_phone ||
          property.contact_email) && (
          <div className="mt-7 rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Contact
            </h2>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              {property.contact_name && <p>{property.contact_name}</p>}
              {property.contact_phone && <p>{property.contact_phone}</p>}
              {property.contact_email && <p>{property.contact_email}</p>}
            </div>
          </div>
        )}

        {(property.instagram ||
          property.tiktok ||
          property.whatsapp ||
          property.other_social) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {property.instagram && (
              <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                Instagram: {property.instagram}
              </span>
            )}
            {property.tiktok && (
              <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                TikTok: {property.tiktok}
              </span>
            )}
            {property.whatsapp && (
              <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                WhatsApp: {property.whatsapp}
              </span>
            )}
            {property.other_social && (
              <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                {property.other_social}
              </span>
            )}
          </div>
        )}
      </section>

      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 px-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6">
            {reportDone ? (
              <>
                <h3 className="text-lg font-bold text-white">
                  Report submitted
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Thank you. MyKove will review this listing.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReportOpen(false);
                    setReportDone(false);
                    setReportDetails("");
                  }}
                  className="mt-6 w-full rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white">
                  Report this listing
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Let us know what seems wrong with this property.
                </p>

                {reportError && (
                  <div className="mt-4 rounded-xl border border-red-900 bg-red-950 p-3 text-sm text-red-300">
                    {reportError}
                  </div>
                )}

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-green-500"
                  >
                    {reportReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Additional details (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Anything else MyKove should know"
                    className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-green-500"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitReport}
                    disabled={reportLoading}
                    className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reportLoading ? "Submitting..." : "Submit report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
