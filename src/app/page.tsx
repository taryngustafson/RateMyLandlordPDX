import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Get recent reviews
  const recentReviews = await prisma.review.findMany({
    include: {
      landlord: { select: { id: true, name: true, company: true, city: true } },
      property: { select: { address: true, neighborhood: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });



  return (
    <div>
      {/* Hero — subtle, not salesy */}
      <section className="bg-emerald-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-lg font-semibold mb-1">
            Portland landlord reviews, by tenants
          </h1>
          <p className="text-sm text-emerald-200">
            Anonymous reviews from real renters across the Portland metro area.
          </p>
        </div>
      </section>

      {/* Search + Write a Review */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form action="/search" method="GET" className="flex-1">
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <input
                type="text"
                name="q"
                placeholder="Search by landlord name or company..."
                className="flex-1 bg-white px-3 py-2.5 text-gray-900 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 text-sm font-medium transition-colors border-l border-gray-300"
              >
                Search
              </button>
            </div>
          </form>
          <Link
            href="/review"
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors text-center"
          >
            Write a Review
          </Link>
        </div>
      </section>

      {/* Browse by City */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-3">Browse by city</h2>
        <div className="flex flex-wrap gap-2">
          {[
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
          ].map((city) => (
            <Link
              key={city}
              href={`/search?city=${encodeURIComponent(city)}`}
              className="bg-white border border-gray-200 rounded-full px-4 py-1.5 hover:border-emerald-400 transition-colors text-sm text-gray-700"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works — shown when no reviews exist yet */}
      {recentReviews.length === 0 && (
        <section className="max-w-4xl mx-auto px-4 py-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-4">How it works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm font-semibold text-emerald-700 mb-1">1. Find your landlord</p>
              <p className="text-sm text-gray-600">
                Search by name or company. If they&apos;re not listed yet, add them.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm font-semibold text-emerald-700 mb-1">2. Write a review</p>
              <p className="text-sm text-gray-600">
                Rate across 5 categories. No account needed, fully anonymous.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm font-semibold text-emerald-700 mb-1">3. Help other tenants</p>
              <p className="text-sm text-gray-600">
                Your review helps renters make better decisions before signing a lease.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Recent reviews</h2>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      href={`/landlord/${review.landlord.id}`}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {review.landlord.name}
                    </Link>
                    {review.property && (
                      <p className="text-sm text-gray-500">
                        {review.property.address}
                        {review.property.neighborhood &&
                          ` · ${review.property.neighborhood}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.overallRating} size="sm" />
                  </div>
                </div>
                <h3 className="font-medium mb-1">{review.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {review.body}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  {review.wouldRecommend && (
                    <span className="text-emerald-600">Would recommend</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


    </div>
  );
}