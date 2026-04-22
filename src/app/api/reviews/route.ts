import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    landlordId,
    propertyId,
    overallRating,
    responsivenessRating,
    maintenanceRating,
    fairnessRating,
    communicationRating,
    title,
    body: reviewBody,
    pros,
    cons,
    leaseStartYear,
    leaseEndYear,
    rentAmount,
    wouldRecommend,
  } = body;

  // Validate required fields
  if (!landlordId || !title || !reviewBody) {
    return NextResponse.json(
      { error: "Landlord ID, title, and review body are required" },
      { status: 400 }
    );
  }

  // Validate ratings are 1-5
  const ratings = [overallRating, responsivenessRating, maintenanceRating, fairnessRating, communicationRating];
  if (ratings.some((r) => r < 1 || r > 5)) {
    return NextResponse.json(
      { error: "All ratings must be between 1 and 5" },
      { status: 400 }
    );
  }

  // Verify landlord exists
  const landlord = await prisma.landlord.findUnique({
    where: { id: landlordId },
  });

  if (!landlord) {
    return NextResponse.json(
      { error: "Landlord not found" },
      { status: 404 }
    );
  }

  const review = await prisma.review.create({
    data: {
      landlordId,
      propertyId: propertyId || null,
      overallRating,
      responsivenessRating,
      maintenanceRating,
      fairnessRating,
      communicationRating,
      title,
      body: reviewBody,
      pros: pros || null,
      cons: cons || null,
      leaseStartYear: leaseStartYear || null,
      leaseEndYear: leaseEndYear || null,
      rentAmount: rentAmount || null,
      wouldRecommend: wouldRecommend || false,
    },
  });

  return NextResponse.json(review, { status: 201 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const landlordId = searchParams.get("landlordId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: Record<string, unknown> = {};
  if (landlordId) where.landlordId = landlordId;

  const reviews = await prisma.review.findMany({
    where,
    include: {
      landlord: { select: { name: true, company: true } },
      property: { select: { address: true, city: true, neighborhood: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(reviews);
}