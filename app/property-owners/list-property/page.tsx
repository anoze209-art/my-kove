"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type PropertyPhoto = {
  id: string;
  file: File;
  url: string;
};
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
];
const propertyTypes = [
  "Hostel",
  "Apartment",
  "Short Stay",
  "House",
  "Duplex",
  "Other",
];

export default function ListProperty() {
  const router = useRouter();
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [customType, setCustomType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [pricePeriod, setPricePeriod] = useState("per year");
  const [units, setUnits] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState("");
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
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
    const alreadyExists =
      facilities.some(
        (facility) => facility.toLowerCase() === trimmed.toLowerCase()
      ) ||
      customFacilities.some(
        (facility) => facility.toLowerCase() === trimmed.toLowerCase()
      );

    if (alreadyExists) {
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
    const remainingSlots = 10 - photos.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const newPhotos: PropertyPhoto[] = selectedFiles.map((file) => ({
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
    setPhotos((current) => {
      const photoToRemove = current.find((photo) => photo.id === id);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return current.filter((photo) => photo.id !== id);
    });
    if (coverPhotoId === id) {
      const remainingPhotos = photos.filter((photo) => photo.id !== id);
      setCoverPhotoId(remainingPhotos[0]?.id ?? null);
    }
  }
  const resolvedType =
    propertyType === "Other"
      ? customType.trim() || "Other"
      : propertyType;
  const allFacilities = [...facilities, ...customFacilities];
  const coverPhoto =
    photos.find((photo) => photo.id === coverPhotoId) ?? photos[0];
  const otherPhotos = photos.filter(
    (photo) => photo.id !== coverPhoto?.id
  );
  function openPreview(e: React.FormEvent) {
    e.preventDefault();
    setPreview(true);
  }
  async function handleSubmit() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert(
        "Your property has been submitted for verification. Database submission will be connected in the next stage."
      );
    }, 700);
  }
  const inputClass =
    "w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500";
  const labelClass =
    "mb-2 block text-sm font-medium text-gray-300";
  const cardClass =
    "rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8";

  if (preview) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100">
        <header className="border-b border-gray-800 bg-gray-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                My<span className="text-green-500">Kove</span>
              </h1>
              <p className="text-xs text-gray-400">
                Listing Preview
              </p>
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
          <div className="mb-6 rounded-2xl border border-green-900 bg-green-950/40 p-5">
            <p className="text-sm font-semibold text-green-400">
              LISTING PREVIEW
            </p>
            <p className="mt-1 text-sm leading-6 text-green-200/70">
              This is how your property listing can appear to people
              browsing MyKove. Nothing has been published yet.
            </p>
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
                <div className="flex h-full items-center justify-center text-gray-600">
                  No cover photo uploaded
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    {propertyName || "Untitled Property"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {location || "Location not set"}
                    {resolvedType ? ` · ${resolvedType}` : ""}
                  </p>
                </div>
                {price && (
                  <div className="h-fit rounded-full bg-green-950 px-4 py-2 text-sm font-semibold text-green-400">
                    ₦{Number(price).toLocaleString()} {pricePeriod}
                  </div>
                )}
              </div>
              {address && (
                <p className="mt-5 text-sm text-gray-400">
                  📍 {address}
                </p>
              )}
              {units && (
                <p className="mt-2 text-sm text-gray-400">
                  🏠 {units} unit
                  {Number(units) === 1 ? "" : "s"} available
                </p>
              )}
              {description && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    About this property
                  </h3>

                  <p className="mt-2 whitespace-pre-line leading-7 text-gray-300">
                    {description}
                  </p>
                </div>
              )}
              {allFacilities.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Facilities & Amenities
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
              {(contactName ||
                contactPhone ||
                contactEmail) && (
                <div className="mt-7 rounded-xl border border-gray-800 bg-gray-950 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Contact
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-300">
                    {contactName && <p>{contactName}</p>}
                    {contactPhone && <p>📞 {contactPhone}</p>}
                    {contactEmail && <p>✉️ {contactEmail}</p>}
                  </div>
                </div>
              )}
              {(instagram ||
                tiktok ||
                whatsapp ||
                otherSocial) && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Social & Other Contact
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {instagram && (
                      <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                        Instagram: {instagram}
                      </span>
                    )}
                    {tiktok && (
                      <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                        TikTok: {tiktok}
                      </span>
                    )}
                    {whatsapp && (
                      <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                        WhatsApp: {whatsapp}
                      </span>
                    )}
                    {otherSocial && (
                      <span className="rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300">
                        {otherSocial}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {otherPhotos.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    More Photos
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {otherPhotos.map((photo) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Property"
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
            onClick={() =>
              router.push("/property-owners/dashboard")
            }
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
          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Provide accurate information about your property so
            people can understand what you offer.
          </p>
        </div>
        <form
          onSubmit={openPreview}
          className="space-y-6"
        >
          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              These are some of the first details people will see.
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) =>
                    setPropertyName(e.target.value)
                  }
                  placeholder="e.g. Fort Lugard Apartments"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Property Type
                </label>
                <select
                  required
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="" disabled>
                    Choose a property type
                  </option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {propertyType === "Other" && (
                <div>
                  <label className={labelClass}>
                    Enter Property Type
                  </label>
                  <input
                    type="text"
                    required
                    value={customType}
                    onChange={(e) =>
                      setCustomType(e.target.value)
                    }
                    placeholder="e.g. Student Lodge, Estate, Office Complex"
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Use this if your property does not fit
                    any of the options above.
                  </p>
                </div>
              )}
              <div>
                <label className={labelClass}>
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the property, its surroundings, facilities and what makes it a good place to stay..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">
              Location
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Help people know exactly where the property is.
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>
                  Area / Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Property Location"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Full Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
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
              Let potential customers know what to expect.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Price
                </label>

                <div className="flex overflow-hidden rounded-xl border border-gray-700 bg-gray-950 focus-within:border-green-500">
                  <span className="flex items-center px-4 text-gray-500">
                    ₦
                  </span>

                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="e.g. 850000"
                    className="w-full bg-transparent px-2 py-3 text-white placeholder:text-gray-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Price Period
                </label>

                <select
                  value={pricePeriod}
                  onChange={(e) =>
                    setPricePeriod(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="per year">
                    Per Year
                  </option>

                  <option value="per month">
                    Per Month
                  </option>

                  <option value="per night">
                    Per Night
                  </option>

                  <option value="per week">
                    Per Week
                  </option>

                  <option value="negotiable">
                    Negotiable
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Available Units / Rooms
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  value={units}
                  onChange={(e) =>
                    setUnits(e.target.value)
                  }
                  placeholder="e.g. 12"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          <div className={cardClass}>
            <h3 className="text-xl font-bold text-white">
              Facilities & Amenities
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Select everything available at the property.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facilityOptions.map((facility) => {
                const selected =
                  facilities.includes(facility);

                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() =>
                      toggleFacility(facility)
                    }
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
              <label className={labelClass}>
                Other Facilities
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFacility}
                  onChange={(e) =>
                    setCustomFacility(e.target.value)
                  }
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
                        onClick={() =>
                          removeCustomFacility(facility)
                        }
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
            <h3 className="text-xl font-bold text-white">
              Property Photos
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Upload up to 10 photos. The cover photo is
              the main image people will see.
            </p>

            <div className="mt-6">
              <label
                htmlFor="photo-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-950 px-4 py-8 text-center transition hover:border-green-600 hover:bg-gray-900"
              >
                <span className="text-3xl">
                  📸
                </span>

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
                  const isCover =
                    photo.id === coverPhotoId;

                  return (
                    <div
                      key={photo.id}
                      className={`group relative overflow-hidden rounded-xl border ${
                        isCover
                          ? "border-green-500"
                          : "border-gray-700"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt="Property"
                        onClick={() =>
                          setCoverPhotoId(photo.id)
                        }
                        className="aspect-square w-full cursor-pointer object-cover transition group-hover:scale-105"
                      />

                      {isCover && (
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Cover
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removePhoto(photo.id)
                        }
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-950/80 text-xs text-gray-300 transition hover:bg-red-600 hover:text-white"
                        aria-label="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {photos.length > 0 && (
              <p className="mt-4 text-xs text-gray-500">
                Tap any photo to make it the cover photo.
              </p>
            )}
          </div>
        <p className="mt-1 text-sm leading-6 text-gray-400">
  Use contact details and social media accounts that interested people can
  use to reach the property or its representative.
</p>

<div className="mt-4 rounded-xl border border-green-900 bg-green-950/40 p-4">
  <p className="text-sm font-medium text-green-400">
    Important
  </p>
  <p className="mt-1 text-sm leading-6 text-green-200/70">
    These details will be displayed on your property listing. Use contact
    information that customers can use to make enquiries about this property.
  </p>
</div>
            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>
                  Contact Name
                </label>

                <input
                  type="text"
                  value={contactName}
                  onChange={(e) =>
                    setContactName(e.target.value)
                  }
                  placeholder="Contact Name"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) =>
                      setContactPhone(e.target.value)
                    }
                    placeholder="Contact Number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Email
                  </label>

                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) =>
                      setContactEmail(e.target.value)
                    }
                    placeholder="Contact Email"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) =>
                      setInstagram(e.target.value)
                    }
                    placeholder="Insta Handle"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    TikTok
                  </label>

                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) =>
                      setTiktok(e.target.value)
                    }
                    placeholder="Tiktok Handle"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    WhatsApp
                  </label>

                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) =>
                      setWhatsapp(e.target.value)
                    }
                    placeholder="Whatsapp Number"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Other Social / Contact
                </label>

                <input
                  type="text"
                  value={otherSocial}
                  onChange={(e) =>
                    setOtherSocial(e.target.value)
                  }
                  placeholder="Other Handles"
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
                  Your property may go through MyKove&apos;s
                  verification process before receiving a
                  verified badge. Verification helps users
                  identify listings that have been reviewed by
                  MyKove.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push("/property-owners/dashboard")
              }
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
