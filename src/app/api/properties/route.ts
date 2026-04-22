import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { address, unit, city, state, zipCode, neighborhood, propertyType, landlordId } = body;

  if (!address || !city || !zipCode || !landlordId) {
    return NextResponse.json(
      { error: "Address, city, zip code, and landlord ID are required" },
      { status: 400 }
    );
  }

  const landlord = await prisma.landlord.findUnique({
    where: { id: landlordId },
  });

  if (!landlord) {
    return NextResponse.json({ error: "Landlord not found" }, { status: 404 });
  }

  const property = await prisma.property.create({
    data: {
      address,
      unit: unit || null,
      city,
      state: state || "OR",
      zipCode,
      neighborhood: neighborhood || null,
      propertyType: propertyType || "apartment",
      landlordId,
    },
  });

  return NextResponse.json(property, { status: 201 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const landlordId = searchParams.get("landlordId");

  const where: Record<string, unknown> = {};
  if (landlordId) where.landlordId = landlordId;

  const properties = await prisma.property.findMany({
    where,
    include: {
      landlord: { select: { name: true } },
    },
    orderBy: { address: "asc" },
  });

  return NextResponse.json(properties);
}