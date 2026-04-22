"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StarRating from "@/components/StarRating";
import { Suspense } from "react";

interface LandlordResult {
  id: string;
  name: string;
  company: string | null;
  city: string;
  state: string;
  propertyCount: number;
  reviewCount: number;
  avgOverall: number;
  recommendPct: number;
}

const PORTLAND_METRO_CITIES = [
  "All Cities",
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
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";

  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [results, setResults] = useState<LandlordResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city && city !== "All Cities") params.set("city", city);
    params.set("sort", sortBy);

    const res = await fetch(`/api/landlords?${params.toString()}`);
    const data = await res.json();
    setResults(data.landlords);
    setTotal(data.total);
    setLoading(false);
  }, [query, city, sortBy]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Landlords</h1>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, phone, or email..."
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {PORTLAND_METRO_CITIES.map((c) => (
              <option key={c} value={c === "All Cities" ? "" : c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="name">Sort: A–Z</option>
            <option value="reviews">Sort: Most Reviews</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-500">
        {loading ? "Searching..." : `${total} landlord${total !== 1 ? "s" : ""} found`}
      </div>

      {!loading && results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-4 text-gray-300">—</p>
          <h3 className="text-lg font-semibold mb-2">No landlords found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or{" "}
            <Link href="/add-landlord" className="text-emerald-600 hover:underline">
              add a new landlord
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((landlord) => (
          <Link
            key={landlord.id}
            href={`/landlord/${landlord.id}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">{landlord.name}</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {landlord.city}, {landlord.state}
                  </span>
                </div>
                {landlord.company && (
                  <p className="text-gray-500 text-sm">{landlord.company}</p>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <StarRating rating={Math.round(landlord.avgOverall)} size="sm" />
                    <span className="text-sm font-medium ml-1">
                      {landlord.avgOverall > 0 ? landlord.avgOverall : "—"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {landlord.reviewCount} review{landlord.reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {landlord.recommendPct > 0 ? `${landlord.recommendPct}%` : "—"}
                  </p>
                  <p className="text-xs text-gray-500">recommend</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{landlord.propertyCount}</p>
                  <p className="text-xs text-gray-500">properties</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Search Landlords</h1>
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}