import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Caution List — RateMyLandlordPDX",
  description:
    "Landlords in the Portland area with consistently poor reviews and red flags from multiple tenants.",
};

export default async function CautionListPage() {
  // Get all landlords with at least 2 reviews
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
          body: true,
          cons: true,
        },
      },
      _count: { select: { reviews: true, properties: true } },
    },
  });

  // Red flag keywords to scan for
  const RED_FLAG_KEYWORDS = [
    "mold", "mould", "unsafe", "illegal", "discrimination", "discriminate",
    "retaliation", "retaliatory", "deposit theft", "kept deposit", "refused to return",
    "cockroach", "roach", "rat", "mice", "bed bug", "bedbug", "pest",
    "no heat", "no hot water", "broken heater", "no water",
    "harassment", "threatened", "threatening", "intimidation",
    "illegal entry", "entered without", "no notice",
    "health hazard", "uninhabitable", "unlivable",
    "scam", "fraud", "dishonest", "lied", "lying",
  ];

  // Calculate scores and filter for caution list
  const cautionLandlords = landlords
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

      // Count red flags
      let redFlagCount = 0;
      const flagsFound = new Set<string>();
      for (const review of l.reviews) {
        const text = `${review.body} ${review.cons || ""}`.toLowerCase();
        for (const keyword of RED_FLAG_KEYWORDS) {
          if (text.includes(keyword)) {
            redFlagCount++;
            flagsFound.add(keyword);
          }
        }
      }

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
        redFlagCount,
        flagsFound: Array.from(flagsFound),
      };
    })
    .filter(
      (l) =>
        // Caution criteria: avg rating ≤ 2.5 OR recommend < 30% OR 2+ red flags
        l.avgOverall <= 2.5 || l.recommendPct < 30 || l.redFlagCount >= 2
    )
    .sort((a, b) => a.avgOverall - b.avgOverall);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">Caution List</h1>
      </div>
      <p className="text-gray-500 mb-2">
        Landlords with consistently poor reviews, low recommendation rates, or
        red flags reported by multiple tenants.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        This list is auto-generated from anonymous tenant reviews. It is not a
        legal finding — it reflects reported tenant experiences. Landlords
        appear here if they have an average rating ≤ 2.5, less than 30%
        recommendation rate, or multiple red flag reports.
      </p>

      {cautionLandlords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-4 text-gray-300">—</p>
          <h3 className="text-lg font-semibold mb-2">
            No landlords on the caution list
          </h3>
          <p className="text-gray-500">
            No landlords currently meet the criteria for the caution list. As
            more reviews come in, this page will update automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cautionLandlords.map((l) => (
            <Link
              key={l.id}
              href={`/landlord/${l.id}`}
              className="block bg-white border border-red-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{l.name}</h3>
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Caution
                    </span>
                  </div>
                  {l.company && (
                    <p className="text-gray-500 text-sm">{l.company}</p>
                  )}
                  <p className="text-sm text-gray-400">{l.city}, OR</p>

                  {/* Red flags */}
                  {l.flagsFound.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {l.flagsFound.slice(0, 5).map((flag) => (
                        <span
                          key={flag}
                          className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
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
                    <p className="text-2xl font-bold text-red-600">
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

      {/* Resources link */}
      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="font-bold text-lg mb-2">
          Having issues with a landlord on this list?
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          You have rights as a tenant. Check out our resources page for free
          legal help and how to file complaints.
        </p>
        <Link
          href="/resources"
          className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          View Tenant Resources →
        </Link>
      </div>
    </div>
  );
}