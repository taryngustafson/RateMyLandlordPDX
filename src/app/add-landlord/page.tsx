"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DuplicateSuggestion {
  id: string;
  name: string;
  company: string | null;
  city: string;
  reviewCount: number;
  avgRating: number;
  aliases: string[];
}

const PORTLAND_METRO_CITIES = [
  "Portland",
  "Beaverton",
  "Hillsboro",
  "Gresham",
  "Tigard",
  "Lake Oswego",
  "Milwaukie",
  "Oregon City",
  "Tualatin",
  "West Linn",
  "Clackamas",
  "Happy Valley",
  "Sherwood",
  "Wilsonville",
  "Troutdale",
  "Fairview",
  "Wood Village",
  "Gladstone",
  "Canby",
  "Sellwood",
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "duplex", label: "Duplex" },
];

const NEIGHBORHOODS = [
  "Alberta Arts District",
  "Alphabet District",
  "Beaumont-Wilshire",
  "Belmont",
  "Brooklyn",
  "Buckman",
  "Division",
  "Downtown",
  "Foster-Powell",
  "Goose Hollow",
  "Hawthorne",
  "Hollywood",
  "Irvington",
  "Kerns",
  "King",
  "Ladd's Addition",
  "Laurelhurst",
  "Lloyd District",
  "Mississippi",
  "Montavilla",
  "Mt. Tabor",
  "Nob Hill",
  "North Portland",
  "Northeast Portland",
  "Northwest Portland",
  "Pearl District",
  "Richmond",
  "Rose City Park",
  "Sellwood-Moreland",
  "South Waterfront",
  "Southeast Portland",
  "St. Johns",
  "Sunnyside",
  "Woodstock",
];

export default function AddLandlordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"landlord" | "property" | "done">("landlord");
  const [landlordId, setLandlordId] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [duplicates, setDuplicates] = useState<DuplicateSuggestion[]>([]);
  const [dismissedDuplicates, setDismissedDuplicates] = useState(false);

  const [landlordForm, setLandlordForm] = useState({
    name: "",
    company: "",
    city: "Portland",
    state: "OR",
    phone: "",
    email: "",
    website: "",
  });

  // Check for duplicates as user types
  const checkDuplicates = useCallback(async (name: string) => {
    if (name.length < 3) {
      setDuplicates([]);
      return;
    }
    const res = await fetch(`/api/landlords/search?q=${encodeURIComponent(name)}`);
    const data = await res.json();
    setDuplicates(data);
    setDismissedDuplicates(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkDuplicates(landlordForm.name);
    }, 400);
    return () => clearTimeout(timer);
  }, [landlordForm.name, checkDuplicates]);

  const [propertyForm, setPropertyForm] = useState({
    address: "",
    unit: "",
    city: "Portland",
    state: "OR",
    zipCode: "",
    neighborhood: "",
    propertyType: "apartment",
  });

  const handleLandlordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!landlordForm.name.trim()) {
      setError("Landlord name is required");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/landlords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(landlordForm),
    });

    if (res.ok) {
      const data = await res.json();
      setLandlordId(data.id);
      setLandlordName(data.name);
      setStep("property");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }

    setSubmitting(false);
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!propertyForm.address.trim() || !propertyForm.zipCode.trim()) {
      setError("Address and zip code are required");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...propertyForm,
        landlordId,
      }),
    });

    if (res.ok) {
      setStep("done");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }

    setSubmitting(false);
  };

  if (step === "done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-3xl font-bold text-emerald-600 mb-4">Done</p>
        <h1 className="text-2xl font-bold mb-2">Landlord Added!</h1>
        <p className="text-gray-600 mb-6">
          {landlordName} has been added. You can now write a review.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push(`/review?landlordId=${landlordId}`)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Write a Review
          </button>
          <button
            onClick={() => router.push(`/landlord/${landlordId}`)}
            className="bg-white text-emerald-700 border border-emerald-300 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Add a Landlord</h1>
      <p className="text-gray-500 mb-8">
        Add a landlord to our database so tenants can review them.
      </p>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`flex items-center gap-2 ${
            step === "landlord"
              ? "text-emerald-600 font-semibold"
              : "text-gray-400"
          }`}
        >
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
            1
          </span>
          Landlord Info
        </div>
        <div className="flex-1 h-px bg-gray-300" />
        <div
          className={`flex items-center gap-2 ${
            step === "property"
              ? "text-emerald-600 font-semibold"
              : "text-gray-400"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
              step === "property"
                ? "bg-emerald-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </span>
          Add Property
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {step === "landlord" && (
        <form onSubmit={handleLandlordSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Landlord Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landlord Name *
                </label>
                <input
                  type="text"
                  value={landlordForm.name}
                  onChange={(e) =>
                    setLandlordForm({ ...landlordForm, name: e.target.value })
                  }
                  placeholder="e.g., John Smith or Smith Properties LLC"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* Duplicate warning */}
                {duplicates.length > 0 && !dismissedDuplicates && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-amber-800 mb-2">
                      We found similar landlords already in our database:
                    </p>
                    <div className="space-y-2 mb-3">
                      {duplicates.map((d) => (
                        <div
                          key={d.id}
                          className="flex justify-between items-center bg-white rounded-lg p-3 border border-amber-100"
                        >
                          <div>
                            <p className="font-medium text-sm">{d.name}</p>
                            {d.company && (
                              <p className="text-xs text-gray-500">{d.company}</p>
                            )}
                            <p className="text-xs text-gray-400">
                              {d.city} · {d.reviewCount} review{d.reviewCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <Link
                            href={`/review?landlordId=${d.id}`}
                            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 whitespace-nowrap"
                          >
                            Review this one
                          </Link>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDismissedDuplicates(true)}
                      className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                    >
                      None of these — I want to add a new landlord →
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company / Property Management (optional)
                </label>
                <input
                  type="text"
                  value={landlordForm.company}
                  onChange={(e) =>
                    setLandlordForm({
                      ...landlordForm,
                      company: e.target.value,
                    })
                  }
                  placeholder="e.g., ABC Property Management"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <select
                  value={landlordForm.city}
                  onChange={(e) =>
                    setLandlordForm({ ...landlordForm, city: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {PORTLAND_METRO_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact info */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <p className="text-xs text-gray-400 mb-3">
                  Contact info helps other tenants find this landlord. All fields optional.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={landlordForm.phone}
                      onChange={(e) =>
                        setLandlordForm({ ...landlordForm, phone: e.target.value })
                      }
                      placeholder="503-555-1234"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={landlordForm.email}
                      onChange={(e) =>
                        setLandlordForm({ ...landlordForm, email: e.target.value })
                      }
                      placeholder="info@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={landlordForm.website}
                      onChange={(e) =>
                        setLandlordForm({ ...landlordForm, website: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Next: Add Property →"}
            </button>
          </div>
        </form>
      )}

      {step === "property" && (
        <form onSubmit={handlePropertySubmit} className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800">
            Landlord <strong>{landlordName}</strong> created! Now add a
            property (optional).
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Property Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={propertyForm.address}
                  onChange={(e) =>
                    setPropertyForm({
                      ...propertyForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="e.g., 1234 SE Hawthorne Blvd"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit # (optional)
                  </label>
                  <input
                    type="text"
                    value={propertyForm.unit}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        unit: e.target.value,
                      })
                    }
                    placeholder="e.g., 4B"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={propertyForm.zipCode}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        zipCode: e.target.value,
                      })
                    }
                    placeholder="97214"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    value={propertyForm.city}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        city: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {PORTLAND_METRO_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyForm.propertyType}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        propertyType: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Neighborhood (optional)
                </label>
                <select
                  value={propertyForm.neighborhood}
                  onChange={(e) =>
                    setPropertyForm({
                      ...propertyForm,
                      neighborhood: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select a neighborhood...</option>
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push(`/review?landlordId=${landlordId}`)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip — go to review →
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Property"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}