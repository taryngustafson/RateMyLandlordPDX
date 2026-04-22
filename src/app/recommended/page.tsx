import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recommended Landlords — RateMyLandlordPDX",
  description:
    "Top-rated landlords in the Portland metro area based on anonymous tenant reviews.",
};

export default async function RecommendedPage() {
  const landlords = await prisma.landlord.findMany({
    where: {
      reviews: { some: {} },
    },
    include: {
      reviews: {
        select: {
          overallRating: true,
          responsivenessRating: true,
          maintenanceRating: true,
          fairnessRating: true,
          communicationRating: true,
          wouldRecommend: true,
        },
      },
      properties: {
        select: { city: true, neighborhood: true },
      },
      _count: { select: { reviews: true, properties: true } },
    },
  });

  const recommendedLandlords = landlords
    .map((l) => {
      const reviewCount = l.reviews.length;
      const avgOverall =
        l.reviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount;
      const avgResponsiveness =
        l.reviews.reduce((s, r) => s + r.responsivenessRating, 0) / reviewCount;
      const avgMaintenance =
        l.reviews.reduce((s, r) => s + r.maintenanceRating, 0) / reviewCount;
      const avgFairness =
        l.reviews.reduce((s, r) => s + r.fairnessRating, 0) / reviewCount;
      const avgCommunication =
        l.reviews.reduce((s, r) => s + r.communicationRating, 0) / reviewCount;
      const recommendPct = Math.round(
        (l.reviews.filter((r) => r.wouldRecommend).length / reviewCount) * 100
      );

      // Find strongest category
      const categories = [
        { name: "Responsiveness", value: avgResponsiveness },
        { name: "Maintenance", value: avgMaintenance },
        { name: "Fairness", value: avgFairness },
        { name: "Communication", value: avgCommunication },
      ];
      const strongest = categories.sort((a, b) => b.value - a.value)[0];

      // Neighborhoods served
      const neighborhoods = [
        ...new Set(l.properties.map((p) => p.neighborhood).filter(Boolean)),
      ];

      return {
        id: l.id,
        name: l.name,
        company: l.company,
        city: l.city,
        reviewCount,
        avgOverall: Math.round(avgOverall * 10) / 10,
        avgResponsiveness: Math.round(avgResponsiveness * 10) / 10,
        avgMaintenance: Math.round(avgMaintenance * 10) / 10,
        avgFairness: Math.round(avgFairness * 10) / 10,
        avgCommunication: Math.round(avgCommunication * 10) / 10,
        recommendPct,
        propertyCount: l._count.properties,
        strongestCategory: strongest.name,
        neighborhoods,
      };
    })
    .filter(
      (l) =>
        // Recommended criteria: avg ≥ 3.5 AND recommend ≥ 60%
        l.avgOverall >= 3.5 && l.recommendPct >= 60
    )
    .sort((a, b) => {
      // Sort by recommend %, then by avg rating
      if (b.recommendPct !== a.recommendPct) return b.recommendPct - a.recommendPct;
      return b.avgOverall - a.avgOverall;
    });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🏆</span>
        <h1 className="text-3xl font-bold">Recommended Landlords</h1>
      </div>
      <p className="text-gray-500 mb-2">
        Top-rated landlords in the Portland metro area, based on anonymous
        tenant reviews.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        Landlords appear here if they have an average rating ≥ 3.5 stars and at
        least 60% of reviewers would recommend them. Rankings update
        automatically as new reviews come in.
      </p>

      {recommendedLandlords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-4">📝</p>
          <h3 className="text-lg font-semibold mb-2">
            Not enough reviews yet
          </h3>
          <p className="text-gray-500 mb-4">
            We need more reviews to build the recommended list.{" "}
            <Link href="/review" className="text-emerald-600 hover:underline">
              Write a review
            </Link>{" "}
            to help fellow tenants!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedLandlords.map((l, index) => (
            <Link
              key={l.id}
              href={`/landlord/${l.id}`}
              className="block bg-white border border-emerald-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {index < 3 && (
                      <span className="text-xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg">{l.name}</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      ✓ Recommended
                    </span>
                  </div>
                  {l.company && (
                    <p className="text-gray-500 text-sm">{l.company}</p>
                  )}
                  <p className="text-sm text-gray-400">{l.city}, OR</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded">
                      ⭐ Best at: {l.strongestCategory}
                    </span>
                    {l.neighborhoods.slice(0, 3).map((n) => (
                      <span
                        key={n}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                      >
                        {n}
                      </span>
                    ))}
                    {l.propertyCount > 0 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                        {l.propertyCount} properties
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  {/* Rating breakdown */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 w-20">Overall:</span>
                      <StarRating rating={Math.round(l.avgOverall)} size="sm" />
                      <span className="font-medium">{l.avgOverall}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 w-20">Response:</span>
                      <StarRating rating={Math.round(l.avgResponsiveness)} size="sm" />
                      <span className="font-medium">{l.avgResponsiveness}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 w-20">Maint:</span>
                      <StarRating rating={Math.round(l.avgMaintenance)} size="sm" />
                      <span className="font-medium">{l.avgMaintenance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 w-20">Fairness:</span>
                      <StarRating rating={Math.round(l.avgFairness)} size="sm" />
                      <span className="font-medium">{l.avgFairness}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {l.recommendPct}%
                    </p>
                    <p className="text-xs text-gray-500">recommend</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {l.reviewCount} review{l.reviewCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}