"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import { Suspense } from "react";

interface LandlordSuggestion {
  id: string;
  name: string;
  company: string | null;
  city: string;
  isCurrent?: boolean;
  years?: string;
  propertyAddress?: string;
  reviewCount: number;
  avgRating?: number;
  aliases?: string[];
  matchType?: string;
}

interface PropertyResult {
  id: string;
  address: string;
  unit: string | null;
  city: string;
  complexName: string | null;
  neighborhood: string | null;
}

function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedLandlordId = searchParams.get("landlordId") || "";

  // Step management: address → landlord → review
  const [step, setStep] = useState<"find" | "review">(
    preselectedLandlordId ? "review" : "find"
  );

  // Address lookup state
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<LandlordSuggestion[]>([]);
  const [matchedProperties, setMatchedProperties] = useState<PropertyResult[]>([]);
  const [addressSearched, setAddressSearched] = useState(false);

  // Landlord name search state
  const [landlordQuery, setLandlordQuery] = useState("");
  const [landlordSuggestions, setLandlordSuggestions] = useState<LandlordSuggestion[]>([]);
  const [searchMode, setSearchMode] = useState<"address" | "name">("address");

  // Selected landlord
  const [selectedLandlord, setSelectedLandlord] = useState<LandlordSuggestion | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  // Review form state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    overallRating: 0,
    responsivenessRating: 0,
    maintenanceRating: 0,
    fairnessRating: 0,
    communicationRating: 0,
    title: "",
    body: "",
    pros: "",
    cons: "",
    leaseStartYear: "",
    leaseEndYear: "",
    rentAmount: "",
    wouldRecommend: false,
  });

  // If landlordId is preselected, fetch that landlord
  useEffect(() => {
    if (preselectedLandlordId) {
      fetch(`/api/landlords/${preselectedLandlordId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.id) {
            setSelectedLandlord({
              id: data.id,
              name: data.name,
              company: data.company,
              city: data.city,
              reviewCount: data.reviewCount || 0,
            });
          }
        });
    }
  }, [preselectedLandlordId]);

  // Address lookup with debounce
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setMatchedProperties([]);
      setAddressSearched(false);
      return;
    }
    const res = await fetch(`/api/address-lookup?address=${encodeURIComponent(query)}`);
    const data = await res.json();
    setAddressSuggestions(data.suggestions);
    setMatchedProperties(data.properties);
    setAddressSearched(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchMode === "address") searchAddress(addressQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [addressQuery, searchMode, searchAddress]);

  // Landlord name search with debounce
  const searchLandlord = useCallback(async (query: string) => {
    if (query.length < 2) {
      setLandlordSuggestions([]);
      return;
    }
    const res = await fetch(`/api/landlords/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setLandlordSuggestions(data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchMode === "name") searchLandlord(landlordQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [landlordQuery, searchMode, searchLandlord]);

  const selectLandlord = (landlord: LandlordSuggestion) => {
    setSelectedLandlord(landlord);
    setStep("review");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedLandlord) {
      setError("Please select a landlord");
      return;
    }
    if (form.overallRating === 0) {
      setError("Please provide an overall rating");
      return;
    }
    if (
      form.responsivenessRating === 0 ||
      form.maintenanceRating === 0 ||
      form.fairnessRating === 0 ||
      form.communicationRating === 0
    ) {
      setError("Please rate all categories");
      return;
    }
    if (!form.title.trim() || !form.body.trim()) {
      setError("Please provide a title and review");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        landlordId: selectedLandlord.id,
        propertyId: selectedPropertyId || null,
        ...form,
        leaseStartYear: form.leaseStartYear ? parseInt(form.leaseStartYear) : null,
        leaseEndYear: form.leaseEndYear ? parseInt(form.leaseEndYear) : null,
        rentAmount: form.rentAmount ? parseInt(form.rentAmount) : null,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/landlord/${selectedLandlord.id}`);
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-3xl font-bold text-emerald-600 mb-4">Done</p>
        <h1 className="text-2xl font-bold mb-2">Review Submitted!</h1>
        <p className="text-gray-600">
          Thank you for your anonymous review. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Write an Anonymous Review</h1>
      <p className="text-gray-500 mb-8">
        Your review is completely anonymous. We don&apos;t collect any personal
        information.
      </p>

      {/* STEP 1: Find your landlord */}
      {step === "find" && (
        <div className="space-y-6">
          {/* Search mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              type="button"
              onClick={() => setSearchMode("address")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                searchMode === "address"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Search by Address
            </button>
            <button
              type="button"
              onClick={() => setSearchMode("name")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                searchMode === "name"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Search by Landlord Name
            </button>
          </div>

          {/* Address Search */}
          {searchMode === "address" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold mb-2">What&apos;s your rental address?</h2>
              <p className="text-sm text-gray-500 mb-4">
                We&apos;ll show you landlords and property managers associated with this address.
              </p>
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="Start typing your address... e.g. 1234 SE Hawthorne"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                autoFocus
              />

              {/* Address suggestions */}
              {addressSearched && addressSuggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    We found these landlords at matching addresses:
                  </p>
                  <div className="space-y-2">
                    {addressSuggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          selectLandlord(s);
                          // Auto-select the property if there's a match
                          const matchedProp = matchedProperties.find(
                            (p) => p.address.toLowerCase().includes(addressQuery.toLowerCase())
                          );
                          if (matchedProp) setSelectedPropertyId(matchedProp.id);
                        }}
                        className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-emerald-700">{s.name}</p>
                            {s.company && (
                              <p className="text-sm text-gray-500">{s.company}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {s.propertyAddress} · {s.city}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                s.isCurrent
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {s.isCurrent ? "Current" : s.years}
                            </span>
                            {s.reviewCount > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {s.reviewCount} review{s.reviewCount !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {addressSearched && addressSuggestions.length === 0 && addressQuery.length >= 3 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>No landlords found for this address yet.</strong> You can:
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => setSearchMode("name")}
                      className="text-sm bg-white border border-amber-300 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50"
                    >
                      Search by landlord name instead
                    </button>
                    <a
                      href="/add-landlord"
                      className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                    >
                      Add a new landlord
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Landlord Name Search */}
          {searchMode === "name" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold mb-2">Search for your landlord</h2>
              <p className="text-sm text-gray-500 mb-4">
                Type the name of your landlord or property management company.
              </p>
              <input
                type="text"
                value={landlordQuery}
                onChange={(e) => setLandlordQuery(e.target.value)}
                placeholder="e.g. Pacific Crest, Rose City Rentals..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                autoFocus
              />

              {/* Landlord suggestions */}
              {landlordSuggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {landlordSuggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectLandlord(s)}
                      className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          {s.company && (
                            <p className="text-sm text-gray-500">{s.company}</p>
                          )}
                          {s.aliases && s.aliases.length > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Also known as: {s.aliases.join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                            {s.city}
                          </span>
                          {s.reviewCount > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              {s.reviewCount} review{s.reviewCount !== 1 ? "s" : ""} · {s.avgRating}/5
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results for name search */}
              {landlordQuery.length >= 2 && landlordSuggestions.length === 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    No matching landlords found for &quot;{landlordQuery}&quot;.
                  </p>
                  <a
                    href="/add-landlord"
                    className="inline-block mt-2 text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                  >
                    Add this landlord →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Write the review */}
      {step === "review" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Selected Landlord */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Reviewing:</p>
                <p className="text-lg font-bold text-emerald-800">
                  {selectedLandlord?.name}
                </p>
                {selectedLandlord?.company && (
                  <p className="text-sm text-emerald-700">{selectedLandlord.company}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("find");
                  setSelectedLandlord(null);
                  setSelectedPropertyId("");
                }}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Change
              </button>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Ratings *</h2>
            <div className="space-y-4">
              {[
                { key: "overallRating", label: "Overall Rating" },
                { key: "responsivenessRating", label: "Responsiveness" },
                { key: "maintenanceRating", label: "Maintenance & Repairs" },
                { key: "fairnessRating", label: "Fairness (rent, deposits, etc.)" },
                { key: "communicationRating", label: "Communication" },
              ].map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm font-medium text-gray-700">
                    {cat.label}
                  </label>
                  <StarRating
                    rating={form[cat.key as keyof typeof form] as number}
                    size="lg"
                    interactive
                    onChange={(val) => setForm({ ...form, [cat.key]: val })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Your Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Sum up your experience in a few words..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review *
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Tell us about your experience renting from this landlord..."
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pros
                  </label>
                  <textarea
                    value={form.pros}
                    onChange={(e) => setForm({ ...form, pros: e.target.value })}
                    placeholder="What was good?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cons
                  </label>
                  <textarea
                    value={form.cons}
                    onChange={(e) => setForm({ ...form, cons: e.target.value })}
                    placeholder="What could be better?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tenancy Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Tenancy Details (optional)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lease Start Year
                </label>
                <input
                  type="number"
                  value={form.leaseStartYear}
                  onChange={(e) => setForm({ ...form, leaseStartYear: e.target.value })}
                  placeholder="2023"
                  min={2000}
                  max={2030}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lease End Year
                </label>
                <input
                  type="number"
                  value={form.leaseEndYear}
                  onChange={(e) => setForm({ ...form, leaseEndYear: e.target.value })}
                  placeholder="2024"
                  min={2000}
                  max={2030}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  value={form.rentAmount}
                  onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
                  placeholder="1500"
                  min={0}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.wouldRecommend}
                  onChange={(e) => setForm({ ...form, wouldRecommend: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I would recommend this landlord to other tenants
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Anonymous Review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Write an Anonymous Review</h1>
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <ReviewForm />
    </Suspense>
  );
}