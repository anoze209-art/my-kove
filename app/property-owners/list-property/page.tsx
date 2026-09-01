"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ListProperty() {
  const router = useRouter();
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const [facilities, setFacilities] = useState<string[]>([]);
  const facilityOptions = [
    "Water",
    "Electricity",
    "Parking",
    "Security",
    "Wi-Fi",
    "Generator",
    "Air Conditioning",
    "Furnished",
  ];
  function toggleFacility(facility: string) {
    setFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Property information saved for the next stage.");
    }, 700);
  }
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
            <h3 className="text-xl font-bold text-white">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Start with the basic details people will see on your listing.
            </p>

            <div className="mt-6 space-y-5">
           
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Fort Lugard Apartments"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Property Type
                </label>

                <select
                  required
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select property type</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartment">Apartment</option>
                  <option value="short-stay">Short Stay</option>
                  <option value="house">House</option>
                  <option value="office">Commercial Property</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Description
                </label>

                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property, its surroundings, and what makes it a good place to stay..."
                  className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
            <h3 className="text-xl font-bold text-white">
              Location
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Help people find your property.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Area / Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gwarinpa, Abuja"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Full Address
                </label>

                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter the full property address"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
            <h3 className="text-xl font-bold text-white">
              Pricing & Availability
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Give potential customers an idea of what to expect.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
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
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full bg-transparent px-2 py-3 text-white placeholder:text-gray-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Available Units / Rooms
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
            <h3 className="text-xl font-bold text-white">
              Facilities
            </h3>

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
          </div>

       
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
            <h3 className="text-xl font-bold text-white">
              Property Contact
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Provide a contact number potential customers can use.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Contact Phone Number
              </label>

              <input
                type="tel"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact info"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
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
              onClick={() =>
                router.push("/property-owners/dashboard")
              }
              className="rounded-full border border-gray-700 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
