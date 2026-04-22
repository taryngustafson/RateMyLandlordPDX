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

  // Get stats
  const [totalLandlords, totalReviews, totalProperties] = await Promise.all([
    prisma.landlord.count(),
    prisma.review.count(),
    prisma.property.count(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Know Your Landlord
            <br />
            <span className="text-emerald-200">Before You Sign</span>
          </h1>
          <p className="text-base text-emerald-100 mb-6 max-w-2xl mx-auto">
            Anonymous reviews from real Portland metro area tenants. Search
            landlords, read reviews, and share your experience — no account
            needed.
          </p>

          {/* Search Bar */}
          <form action="/search" method="GET" className="max-w-xl mx-auto">
            <div className="flex rounded-xl overflow-hidden shadow-lg">
              <input
                type="text"
                name="q"
                placeholder="Search by landlord name or company..."
                className="flex-1 bg-white px-5 py-4 text-gray-900 text-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-6 py-4 font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center gap-10">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-700">{totalLandlords}</p>
            <p className="text-emerald-600 text-sm font-medium">Landlords</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-700">{totalReviews}</p>
            <p className="text-emerald-600 text-sm font-medium">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-700">{totalProperties}</p>
            <p className="text-emerald-600 text-sm font-medium">Properties</p>
          </div>
        </div>
      </section>

      {/* Portland Metro Cities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Browse by City</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-emerald-400 hover:shadow-md transition-all text-sm font-medium"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works — shown when no reviews exist yet */}
      {recentReviews.length === 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-4xl mb-3 font-bold text-emerald-600">1</p>
              <h3 className="font-semibold text-lg mb-2">Find Your Landlord</h3>
              <p className="text-gray-600 text-sm">
                Search by address, landlord name, phone number, or email. If
                they&apos;re not in our system yet, add them in seconds.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-4xl mb-3 font-bold text-emerald-600">2</p>
              <h3 className="font-semibold text-lg mb-2">Write Your Review</h3>
              <p className="text-gray-600 text-sm">
                Rate your landlord across 5 categories. Share the good, the bad,
                and the details. Completely anonymous — no account needed.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-4xl mb-3 font-bold text-emerald-600">3</p>
              <h3 className="font-semibold text-lg mb-2">Help Fellow Tenants</h3>
              <p className="text-gray-600 text-sm">
                Your review helps others make informed decisions. Landlords with
                patterns of issues get flagged on our{" "}
                <Link href="/caution-list" className="text-red-600 hover:underline">
                  Caution List
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/review"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-lg"
            >
              Be the First to Write a Review →
            </Link>
          </div>
        </section>
      )}

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
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

      {/* CTA */}
      <section className="bg-emerald-50 py-12 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Had a rental experience in Portland?
          </h2>
          <p className="text-gray-600 mb-6">
            Help fellow tenants by sharing your anonymous review. No account
            required.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/review"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Write a Review
            </Link>
            <Link
              href="/add-landlord"
              className="bg-white text-emerald-700 border border-emerald-300 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Add a Landlord
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}