import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LandlordPage({ params }: Props) {
  const { id } = await params;

  const landlord = await prisma.landlord.findUnique({
    where: { id },
    include: {
      properties: true,
      reviews: {
        include: {
          property: {
            select: { address: true, unit: true, city: true, neighborhood: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!landlord) notFound();

  const reviewCount = landlord.reviews.length;

  const avgRatings = {
    overall: 0,
    responsiveness: 0,
    maintenance: 0,
    fairness: 0,
    communication: 0,
  };

  if (reviewCount > 0) {
    avgRatings.overall =
      landlord.reviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount;
    avgRatings.responsiveness =
      landlord.reviews.reduce((s, r) => s + r.responsivenessRating, 0) / reviewCount;
    avgRatings.maintenance =
      landlord.reviews.reduce((s, r) => s + r.maintenanceRating, 0) / reviewCount;
    avgRatings.fairness =
      landlord.reviews.reduce((s, r) => s + r.fairnessRating, 0) / reviewCount;
    avgRatings.communication =
      landlord.reviews.reduce((s, r) => s + r.communicationRating, 0) / reviewCount;
  }

  const recommendPct =
    reviewCount > 0
      ? Math.round(
          (landlord.reviews.filter((r) => r.wouldRecommend).length / reviewCount) * 100
        )
      : 0;

  const ratingCategories = [
    { label: "Overall", value: avgRatings.overall },
    { label: "Responsiveness", value: avgRatings.responsiveness },
    { label: "Maintenance", value: avgRatings.maintenance },
    { label: "Fairness", value: avgRatings.fairness },
    { label: "Communication", value: avgRatings.communication },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Landlord Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{landlord.name}</h1>
            {landlord.company && (
              <p className="text-gray-500 text-lg mt-1">{landlord.company}</p>
            )}
            <p className="text-emerald-600 font-medium mt-1">
              {landlord.city}, {landlord.state}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              href={`/review?landlordId=${landlord.id}`}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
            >
              Write a Review
            </Link>
          </div>
        </div>

        {/* Rating Summary */}
        {reviewCount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {ratingCategories.map((cat) => (
                <div key={cat.label} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {cat.value.toFixed(1)}
                  </p>
                  <StarRating rating={Math.round(cat.value)} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">{cat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-semibold">{reviewCount}</p>
                <p className="text-xs text-gray-500">Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-emerald-600">
                  {recommendPct}%
                </p>
                <p className="text-xs text-gray-500">Would Recommend</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{landlord.properties.length}</p>
                <p className="text-xs text-gray-500">Properties</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties */}
      {landlord.properties.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Properties</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {landlord.properties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <p className="font-medium">{property.address}</p>
                {property.unit && (
                  <p className="text-sm text-gray-500">Unit {property.unit}</p>
                )}
                <p className="text-sm text-gray-500">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                <div className="flex gap-3 mt-2">
                  {property.neighborhood && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {property.neighborhood}
                    </span>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                    {property.propertyType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Reviews ({reviewCount})
        </h2>

        {reviewCount === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-4xl mb-3 text-gray-300">—</p>
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">
              Be the first to review this landlord!
            </p>
            <Link
              href={`/review?landlordId=${landlord.id}`}
              className="text-emerald-600 hover:underline font-medium"
            >
              Write a review →
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {landlord.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{review.title}</h3>
                  {review.property && (
                    <p className="text-sm text-gray-500">
                      {review.property.address}
                      {review.property.neighborhood &&
                        ` · ${review.property.neighborhood}`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <StarRating rating={review.overallRating} size="sm" />
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.body}</p>

              {/* Pros/Cons */}
              {(review.pros || review.cons) && (
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  {review.pros && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-700 mb-1">
                        Pros
                      </p>
                      <p className="text-sm text-emerald-800">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">
                        Cons
                      </p>
                      <p className="text-sm text-red-800">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Rating Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {[
                  { label: "Responsive", value: review.responsivenessRating },
                  { label: "Maintenance", value: review.maintenanceRating },
                  { label: "Fairness", value: review.fairnessRating },
                  { label: "Communication", value: review.communicationRating },
                ].map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="text-xs">{cat.label}:</span>
                    <StarRating rating={cat.value} size="sm" />
                  </div>
                ))}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                {review.leaseStartYear && (
                  <span>
                    Lease: {review.leaseStartYear}
                    {review.leaseEndYear && ` – ${review.leaseEndYear}`}
                  </span>
                )}
                {review.rentAmount && (
                  <span>Rent: ${review.rentAmount}/mo</span>
                )}
                {review.wouldRecommend ? (
                  <span className="text-emerald-600">Would recommend</span>
                ) : (
                  <span className="text-red-500">Would not recommend</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}