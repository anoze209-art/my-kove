"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type VerificationRequest = {
  id: string;
  evidence_type: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  property_id: string;
};

type OwnerProperty = {
  id: string;
  name: string;
  authorization_status: string | null;
};

const DOCUMENT_BUCKET = "verification-documents";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const evidenceOptions = [
  {
    value: "ownership_document",
    title: "Ownership document",
    description:
      "A title deed, certificate of occupancy, purchase receipt, or similar proof that you own the property.",
  },
  {
    value: "authorization_letter",
    title: "Authorization letter",
    description:
      "A signed letter from the owner allowing you to advertise the property.",
  },
  {
    value: "management_agreement",
    title: "Management agreement",
    description:
      "A contract showing that you manage the property on the owner's behalf.",
  },
];

function getEvidenceLabel(value: string) {
  return (
    evidenceOptions.find((option) => option.value === value)?.title ?? value
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusStyle(status: string) {
  if (status === "approved") {
    return { label: "Approved", className: "bg-green-950 text-green-400" };
  }

  if (status === "rejected") {
    return { label: "Not approved", className: "bg-red-950 text-red-400" };
  }

  return { label: "Under review", className: "bg-amber-950 text-amber-400" };
}

export default function OwnerVerification() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [properties, setProperties] = useState<OwnerProperty[]>([]);

  const [propertyId, setPropertyId] = useState("");
  const [evidenceType, setEvidenceType] = useState("ownership_document");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);

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

      const { data: requestRows, error: requestsError } = await supabase
        .from("verification_requests")
        .select("id, evidence_type, status, rejection_reason, created_at, property_id")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (requestsError) {
        throw requestsError;
      }

      const loadedRequests = (requestRows ?? []) as VerificationRequest[];
      setRequests(loadedRequests);

      const { data: organization, error: organizationError } = await supabase
        .from("organization")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (organizationError) {
        throw organizationError;
      }

      let loadedProperties: OwnerProperty[] = [];

      if (organization) {
        const { data: propertyRows, error: propertiesError } = await supabase
          .from("properties")
          .select("id, name, authorization_status")
          .eq("organization_id", organization.id)
          .order("created_at", { ascending: false });

        if (propertiesError) {
          throw propertiesError;
        }

        loadedProperties = (propertyRows ?? []) as OwnerProperty[];
      }

      setProperties(loadedProperties);

      const pendingIds = new Set(
        loadedRequests
          .filter((item) => item.status === "pending")
          .map((item) => item.property_id)
      );

      const selectable = loadedProperties.filter(
        (item) =>
          item.authorization_status === "not_submitted" &&
          !pendingIds.has(item.id)
      );

      setPropertyId((current) =>
        current && selectable.some((item) => item.id === current)
          ? current
          : selectable[0]?.id ?? ""
      );
    } catch (err) {
      console.error("Verification page error:", err);
      setError("Could not load your verification details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    setError("");

    const accepted: File[] = [];
    let message = "";

    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        message = "Only JPG, PNG and PDF files are accepted.";
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        message = `${file.name} is larger than 5 MB.`;
        continue;
      }

      accepted.push(file);
    }

    if (files.length + accepted.length > MAX_FILES) {
      message = `You can attach up to ${MAX_FILES} files.`;
    }

    if (message) {
      setError(message);
    }

    setFiles((current) => [...current, ...accepted].slice(0, MAX_FILES));
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!propertyId) {
      setError("Choose the property these documents are for.");
      return;
    }

    if (files.length === 0) {
      setError("Attach at least one document.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be signed in to submit documents.");
      }

      const requestId = crypto.randomUUID();
      const documentPaths: string[] = [];

      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${requestId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(DOCUMENT_BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        documentPaths.push(path);
      }

      const { error: insertError } = await supabase
        .from("verification_requests")
        .insert({
          id: requestId,
          owner_id: user.id,
          property_id: propertyId,
          evidence_type: evidenceType,
          notes: notes.trim() || null,
          document_paths: documentPaths,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("This property already has a request under review.");
        }

        throw insertError;
      }

      setFiles([]);
      setNotes("");

      await loadData();
    } catch (err) {
      console.error("Verification submit error:", err);

      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Something went wrong while submitting your documents.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const propertyName = (id: string) =>
    properties.find((item) => item.id === id)?.name ?? "Property";

  const pendingRequests = requests.filter((item) => item.status === "pending");
  const pendingIds = new Set(pendingRequests.map((item) => item.property_id));

  const selectableProperties = properties.filter(
    (item) =>
      item.authorization_status === "not_submitted" && !pendingIds.has(item.id)
  );

  const selectedLastRequest = requests.find(
    (item) => item.property_id === propertyId
  );

  const showRejection =
    selectedLastRequest && selectedLastRequest.status === "rejected";

  const hasProperties = properties.length > 0;

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
            VERIFICATION
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Verify your property
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Prove that you own a property or are authorized to advertise it.
            Each property is verified separately, so documents for one property
            never cover another.
          </p>
        </div>

        {loading ? (
          <div className={`${cardClass} text-center`}>
            <p className="text-sm text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-amber-800 bg-amber-950/30 p-6"
              >
                <h3 className="text-lg font-bold text-white">
                  {propertyName(item.property_id)} is under review
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-200/80">
                  We received your {getEvidenceLabel(item.evidence_type).toLowerCase()} on{" "}
                  {formatDate(item.created_at)}. This page will update once the
                  review is done.
                </p>
              </div>
            ))}

            {error && (
              <div className="rounded-xl border border-red-900 bg-red-950 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {!hasProperties && (
              <div className={cardClass}>
                <h3 className="text-lg font-bold text-white">
                  You have no listings yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  List a property first, then come back here to verify it.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/property-owners/list-property")}
                  className="mt-5 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
                >
                  List a property
                </button>
              </div>
            )}

            {hasProperties &&
              selectableProperties.length === 0 &&
              pendingRequests.length === 0 && (
                <div className="rounded-2xl border border-green-900 bg-green-950/30 p-6">
                  <h3 className="text-lg font-bold text-white">
                    Nothing to verify right now
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-green-200/70">
                    All of your listings have been verified. When you add a
                    new property, you can verify it here.
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

            {selectableProperties.length > 0 && (
              <form onSubmit={handleSubmit} className={cardClass}>
                <h3 className="text-xl font-bold text-white">
                  Submit your proof
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Your documents are private. Only the MyKove review team can
                  open them.
                </p>

                {showRejection && selectedLastRequest && (
                  <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4">
                    <p className="text-sm font-semibold text-white">
                      Your last request for this property was not approved
                    </p>

                    {selectedLastRequest.rejection_reason && (
                      <p className="mt-1 text-sm leading-6 text-red-200/80">
                        {selectedLastRequest.rejection_reason}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <label className={labelClass}>
                    Which property are you verifying?
                  </label>

                  <select
                    required
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className={inputClass}
                  >
                    {selectableProperties.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <p className={labelClass}>What are you providing?</p>

                  <div className="space-y-3">
                    {evidenceOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                          evidenceType === option.value
                            ? "border-green-600 bg-green-950/30"
                            : "border-gray-700 bg-gray-950 hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="evidenceType"
                          value={option.value}
                          checked={evidenceType === option.value}
                          onChange={() => setEvidenceType(option.value)}
                          className="mt-1 accent-green-500"
                        />

                        <span>
                          <span className="block text-sm font-semibold text-white">
                            {option.title}
                          </span>

                          <span className="mt-1 block text-sm leading-6 text-gray-400">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className={labelClass}>
                    Documents
                  </label>

                  <label
                    htmlFor="verification-files"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-950 px-4 py-8 text-center transition hover:border-green-600 hover:bg-gray-900"
                  >
                    <span className="text-sm font-medium text-gray-300">
                      Choose files
                    </span>

                    <span className="mt-1 text-xs text-gray-500">
                      JPG, PNG or PDF. Up to 5 MB each, maximum 3 files.
                    </span>
                  </label>

                  <input
                    id="verification-files"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleFiles}
                    disabled={files.length >= MAX_FILES}
                    className="hidden"
                  />

                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-gray-200">
                              {file.name}
                            </span>

                            <span className="block text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="shrink-0 text-sm text-gray-400 transition hover:text-red-400"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6">
                  <label className={labelClass}>
                    Notes (optional)
                  </label>

                  <textarea
                    rows={3}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything that helps us understand your documents"
                    className={`${inputClass} resize-none`}
                  />
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

            {requests.length > 0 && (
              <div className={cardClass}>
                <h3 className="text-xl font-bold text-white">
                  Your requests
                </h3>

                <ul className="mt-4 divide-y divide-gray-800">
                  {requests.map((item) => {
                    const style = getStatusStyle(item.status);

                    return (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {propertyName(item.property_id)}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {getEvidenceLabel(item.evidence_type)} · Submitted{" "}
                            {formatDate(item.created_at)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
                        >
                          {style.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
