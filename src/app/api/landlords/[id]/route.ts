import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const landlord = await prisma.landlord.findUnique({
    where: { id },
    include: {
      properties: true,
      reviews: {
        include: {
          property: {
            select: {
              address: true,
              unit: true,
              city: true,
              neighborhood: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!landlord) {
    return NextResponse.json({ error: "Landlord not found" }, { status: 404 });
  }

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

  const roundedRatings = Object.fromEntries(
    Object.entries(avgRatings).map(([k, v]) => [k, Math.round(v * 10) / 10])
  );

  const recommendPct =
    reviewCount > 0
      ? Math.round(
          (landlord.reviews.filter((r) => r.wouldRecommend).length / reviewCount) * 100
        )
      : 0;

  return NextResponse.json({
    ...landlord,
    avgRatings: roundedRatings,
    reviewCount,
    recommendPct,
  });
}