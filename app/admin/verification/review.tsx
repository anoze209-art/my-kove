"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PendingRequest = {
  request_id: string;
  created_at: string;
  evidence_type: string;
  notes: string | null;
  document_paths: string[];
  property_id: string;
  property_name: string;
  property_location: string | null;
  property_address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  owner_email: string | null;
};

type DocumentLink = {
  path: string;
  url: string | null;
};

type RequestWithLinks = PendingRequest & {
  links: DocumentLink[];
};

const DOCUMENT_BUCKET = "verification-documents";

const evidenceLabels: Record<string, string> = {
  ownership_document: "Ownership document",
  authorization_letter: "Authorization letter",
  management_agreement: "Management agreement",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFileKind(path: string) {
  return path.toLowerCase().endsWith(".pdf") ? "PDF" : "Image";
}

export default function VerificationReview() {
  const [requests, setRequests] = useState<RequestWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const { data, error: rpcError } = await supabase.rpc(
        "admin_pending_verifications"
      );

      if (rpcError) {
        throw rpcError;
      }

      const rows = (data ?? []) as PendingRequest[];
      const withLinks: RequestWithLinks[] = [];

      for (const row of rows) {
        const { data: signed } = await supabase.storage
          .from(DOCUMENT_BUCKET)
          .createSignedUrls(row.document_paths, 3600);

        withLinks.push({
          ...row,
          links: row.document_paths.map((path) => ({
            path,
            url: signed?.find((item) => item.path === path)?.signedUrl ?? null,
          })),
        });
      }

      setRequests(withLinks);
    } catch (err) {
      console.error("Load verification requests error:", err);

      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Could not load verification requests.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function review(
    request: RequestWithLinks,
    decision: "approved" | "rejected",
    reason?: string
  ) {
    setBusyId(request.request_id);
    setError("");

    try {
      const { error: rpcError } = await supabase.rpc(
        "review_verification_request",
        {
          request_id: request.request_id,
          decision,
          reason: reason ?? null,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setRequests((current) =>
        current.filter((item) => item.request_id !== request.request_id)
      );
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      console.error("Review error:", err);

      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Could not save your decision.";

      setError(message);
    } finally {
      setBusyId(null);
    }
  }

  function handleApprove(request: RequestWithLinks) {
    const confirmed = window.confirm(
      `Approve the documents for "${request.property_name}"? This verifies this property only.`
    );

    if (confirmed) {
      review(request, "approved");
    }
  }

  function handleConfirmReject(request: RequestWithLinks) {
    if (!rejectReason.trim()) {
      setError("Write the reason the owner will see.");
      return;
    }

    review(request, "rejected", rejectReason.trim());
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-xl border border-red-900 bg-red-950 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-sm text-gray-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h3 className="text-lg font-semibold text-white">
            No requests waiting for review
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            New requests will appear here when owners submit documents.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => (
            <div
              key={request.request_id}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {request.property_name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {[request.property_location, request.property_address]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <span className="w-fit shrink-0 rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-400">
                  Submitted {formatDate(request.created_at)}
                </span>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Owner account</dt>
                  <dd className="mt-0.5 text-gray-200">
                    {request.owner_email ?? "Unknown"}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Listing contact</dt>
                  <dd className="mt-0.5 text-gray-200">
                    {[request.contact_name, request.contact_phone]
                      .filter(Boolean)
                      .join(" · ") || "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Evidence type</dt>
                  <dd className="mt-0.5 text-gray-200">
                    {evidenceLabels[request.evidence_type] ??
                      request.evidence_type}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Owner&apos;s note</dt>
                  <dd className="mt-0.5 text-gray-200">
                    {request.notes || "None"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <p className="text-sm text-gray-500">Documents</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {request.links.map((link, index) =>
                    link.url ? (
                      <a
                        key={link.path}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-green-500 hover:text-green-400"
                      >
                        Document {index + 1} ({getFileKind(link.path)})
                      </a>
                    ) : (
                      <span
                        key={link.path}
                        className="rounded-full border border-red-900 px-4 py-2 text-sm text-red-400"
                      >
                        Document {index + 1} unavailable
                      </span>
                    )
                  )}
                </div>
              </div>

              {rejectingId === request.request_id ? (
                <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-4">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Reason shown to the owner
                  </label>

                  <textarea
                    rows={3}
                    maxLength={300}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="For example: the address on the document does not match the listing."
                    className="w-full resize-none rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-green-500"
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleConfirmReject(request)}
                      disabled={busyId === request.request_id}
                      className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      {busyId === request.request_id
                        ? "Saving..."
                        : "Confirm rejection"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                      className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleApprove(request)}
                    disabled={busyId === request.request_id}
                    className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
                  >
                    {busyId === request.request_id ? "Saving..." : "Approve"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRejectingId(request.request_id);
                      setRejectReason("");
                      setError("");
                    }}
                    disabled={busyId === request.request_id}
                    className="rounded-full border border-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-red-500 hover:text-red-400 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
