"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type PropertyPhoto = {
  id: string;
  file: File;
  url: string;
};

export default function ListProperty() {
  const router = useRouter();

  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [customType, setCustomType] = useState("");
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("");

  const [facilities, setFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState("");
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const facilityOptions = [
    "Wi-Fi",
    "Water",
    "Electricity",
    "Parking",
    "Security",
    "CCTV",
    "Generator",
    "Air Conditioning",
    "Furnished",
    "Kitchen",
    "Laundry",
    "Borehole",
    "Prepaid Meter",
    "Wardrobe",
    "Tiled Floors",
    "Balcony",
  ];

  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [otherSocial, setOtherSocial] = useState("");

  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleFacility(facility: string) {
    setFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility]
    );
  }

  function addCustomFacility() {
    const trimmed = customFacility.trim();
    if (!trimmed) return;
    if (customFacilities.includes(trimmed)) {
      setCustomFacility("");
      return;
    }
    setCustomFacilities((current) => [...current, trimmed]);
    setCustomFacility("");
  }

  function removeCustomFacility(facility: string) {
    setCustomFacilities((current) =>
      current.filter((item) => item !== facility)
    );
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: PropertyPhoto[] = Array.from(files)
      .slice(0, Math.max(0, 10 - photos.length))
      .map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));

    setPhotos((current) => {
      const updated = [...current, ...newPhotos];
      if (!coverPhotoId && updated.length > 0) {
        setCoverPhotoId(updated[0].id);
      }
      return updated;
    });

    e.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
    if (coverPhotoId === id) {
      setCoverPhotoId(null);
    }
  }

  const resolvedType =
    propertyType === "other" ? customType || "Other" : propertyType;

  const allFacilities = [...facilities, ...customFacilities];

  const coverPhoto =
    photos.find((photo) => photo.id === coverPhotoId) ?? photos[0];
  const otherPhotos = photos.filter((photo) => photo.id !== coverPhoto?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Property submitted for verification.");
    }, 700);
  }

  const inputClass =
    "w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500";
  const labelClass = "mb-2 block text-sm font-medium text-gray-300";
  const cardClass =
    "rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8";

  if (preview) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <header className="border-b border-gray-800 bg-gray-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                My<span className="text-green-500">Kove</span>
              </h1>
              <p className="text-xs text-gray-400">Listing Preview</p>
            </div>
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              ← Back to Edit
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 rounded-xl border border-green-900 bg-green-950/40 p-4 text-sm text-green-200/80">
            This is a preview of how your listing will look. Nothing has been
            published yet — tap <strong>Submit Property</strong> when you're
            ready to send it for verification.
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
            <div className="aspect-[16/9] w-full bg-gray-800">
              {coverPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPhoto.url}
                  alt={propertyName || "Property cover photo"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-600">
                  No cover photo uploaded
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {propertyName || "Untitled Property"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {location || "Location not set"}
                    {resolvedType ? ` · ${resolvedType}` : ""}
                  </p>
                </div>
                {price && (
                  <div className="rounded-full bg-green-950 px-4 py-2 text-sm font-semibold text-green-400">
                    ₦{Number(price).toLocaleString()}
                  </div>
                )}
              </div>

              {address && (
                <p className="mt-4 text-sm text-gray-400">{address}</p>
              )}

              {units && (
                <p className="mt-1 text-sm text-gray-400">
                  {units} unit{Number(units) === 1 ? "" : "s"} available
                </p>
              )}

              {description && (
                <p className="mt-5 whitespace-pre-line text-gray-300">
                  {description}
                </p>
              )}

              {allFacilities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Facilities
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allFacilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full border border-gray-700 bg-gray-950 px-3 py-1.5 text-sm text-gray-300"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(contactName || contactPhone || contactEmail) && (
                <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Contact
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-300">
                    {contactName && <p>{contactName}</p>}
                    {contactPhone && <p>{contactPhone}</p>}
                    {contactEmail && <p>{contactEmail}</p>}
                  </div>
                </div>
              )}

              {(instagram || tiktok || whatsapp || otherSocial) && (
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {instagram && (
                    <span className="rounded-full bg-gray-800 px-3 py-1.5 text-gray-300">
                      IG: {instagram}
                    </span>
                  )}
                  {tiktok && (
                    <span className="rounded-full bg-gray-800 px-3 py-1.5 text-gray-300">
                      TikTok: {tiktok}
                    </span>
                  )}
                  {whatsapp && (
                    <span className="rounded-full bg-gray-800 px-3 py-1.5 text-gray-300">
                      WhatsApp: {whatsapp}
                    </span>
                  )}
                  {otherSocial && (
                    <span className="rounded-full bg-gray-800 px-3 py-1.5 text-gray-300">
                      {otherSocial}
                    </span>
                  )}
                </div>
              )}

              {otherPhotos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    More Photos
                  </h3>
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {otherPhotos.map((photo) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt=""
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="rounded-full border border-gray-700 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              ← Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Property"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              My<span className="text-green-500">Kove</span>
            </h1>
            <p className="text-xs text-gray-400">Property Owners</p>
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
      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-500">
            LIST YOUR PROPERTY
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tell us about your property
          </h2>
          <p className="mt-3 max-w-2xl text-gray-400">
            Provide the basic details about your property so we can create
            your MyKove listing.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPreview(true);
          }}
          className="space-y-6"
        >
          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">
              Basic Information
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Start with the basic details people will see on your listing.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>Property Name</label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Fort Lugard Apartments"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Property Type</label>
                <select
                  required
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select property type</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Short Stay">Short Stay</option>
                  <option value="House">House</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {propertyType === "other" && (
                <div>
                  <label className={labelClass}>
                    What type of property is it?
                  </label>
                  <input
                    type="text"
                    required
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. Serviced Office Suite"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property, its surroundings, and what makes it a good place to stay..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">Location</h3>
            <p className="mt-1 text-sm text-gray-400">
              Help people find your property.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>Area / Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gwarinpa, Abuja"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Full Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter the full property address"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">
              Pricing & Availability
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Give potential customers an idea of what to expect.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Price</label>
                <div className="flex overflow-hidden rounded-xl border border-gray-700 bg-gray-950 focus-within:border-green-500">
                  <span className="flex items-center px-4 text-gray-500">
                    ₦
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full bg-transparent px-2 py-3 text-white placeholder:text-gray-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Available Units / Rooms</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="e.g. 10"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">Facilities</h3>
            <p className="mt-1 text-sm text-gray-400">
              Select the facilities available at this property.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facilityOptions.map((facility) => {
                const selected = facilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      selected
                        ? "border-green-600 bg-green-950 text-green-400"
                        : "border-gray-700 bg-gray-950 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                    }`}
                  >
                    {selected ? "✓ " : ""}
                    {facility}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <label className={labelClass}>Other Facilities</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFacility}
                  onChange={(e) => setCustomFacility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomFacility();
                    }
                  }}
                  placeholder="e.g. 24-hour cleaning service"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addCustomFacility}
                  className="shrink-0 rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  Add
                </button>
              </div>

              {customFacilities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customFacilities.map((facility) => (
                    <span
                      key={facility}
                      className="flex items-center gap-2 rounded-full border border-green-800 bg-green-950 px-3 py-1.5 text-sm text-green-400"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeCustomFacility(facility)}
                        className="text-green-500 hover:text-green-300"
                        aria-label={`Remove ${facility}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">Property Photos</h3>
            <p className="mt-1 text-sm text-gray-400">
              Upload up to 10 photos. Tap a photo to set it as the cover
              image.
            </p>

            <div className="mt-6">
              <label
                htmlFor="photo-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-950 px-4 py-8 text-center transition hover:border-green-600"
              >
                <span className="text-2xl">📸</span>
                <span className="mt-2 text-sm font-medium text-gray-300">
                  Tap to upload photos
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {photos.length}/10 uploaded
                </span>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={photos.length >= 10}
                className="hidden"
              />
            </div>
            {photos.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((photo) => {
                  const isCover = photo.id === coverPhotoId;
                  return (
                    <div
                      key={photo.id}
                      className={`group relative overflow-hidden rounded-xl border ${
                        isCover ? "border-green-500" : "border-gray-700"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt=""
                        onClick={() => setCoverPhotoId(photo.id)}
                        className="aspect-square w-full cursor-pointer object-cover"
                      />
                      {isCover && (
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-950/80 text-xs text-gray-300 hover:bg-red-600 hover:text-white"
                        aria-label="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">
              Contact & Socials
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              How should interested people reach you?
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Adaeze Okonkwo"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Contact Info"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>TikTok</label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@yourhandle"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Other Social / Contact</label>
                <input
                  type="text"
                  value={otherSocial}
                  onChange={(e) => setOtherSocial(e.target.value)}
                  placeholder="e.g. Facebook page, X handle..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-900 bg-green-950/40 p-5">
            <div className="flex gap-3">
              <div className="text-xl">🛡️</div>
              <div>
                <h4 className="font-semibold text-green-400">
                  Verification matters
                </h4>
                <p className="mt-1 text-sm leading-6 text-green-200/70">
                  Your property may need to go through MyKove&apos;s
                  verification process before receiving a verified badge.
                  Verification helps people know which listings have been
                  reviewed by MyKove.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/property-owners/dashboard")}
              className="rounded-full border border-gray-700 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-500"
            >
              Preview Listing
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
