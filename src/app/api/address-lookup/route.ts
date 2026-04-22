import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Look up an address and return associated landlords/managers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address")?.trim() || "";

  if (address.length < 3) {
    return NextResponse.json({ properties: [], suggestions: [] });
  }

  const searchTerm = address.toLowerCase();

  // Find properties matching this address
  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { address: { contains: searchTerm } },
        { complexName: { contains: searchTerm } },
      ],
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          company: true,
          city: true,
        },
      },
      managementHistory: {
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              company: true,
              city: true,
            },
          },
        },
        orderBy: { startYear: "desc" },
      },
      _count: { select: { reviews: true } },
    },
    take: 10,
  });

  // Build a deduplicated list of landlords associated with this address
  const landlordMap = new Map<string, {
    id: string;
    name: string;
    company: string | null;
    city: string;
    isCurrent: boolean;
    years: string;
    propertyAddress: string;
    reviewCount: number;
  }>();

  for (const prop of properties) {
    // Current landlord
    if (!landlordMap.has(prop.landlord.id)) {
      landlordMap.set(prop.landlord.id, {
        id: prop.landlord.id,
        name: prop.landlord.name,
        company: prop.landlord.company,
        city: prop.landlord.city,
        isCurrent: true,
        years: "Current",
        propertyAddress: prop.address,
        reviewCount: prop._count.reviews,
      });
    }

    // Historical managers
    for (const mgmt of prop.managementHistory) {
      const existing = landlordMap.get(mgmt.landlord.id);
      const years = mgmt.startYear
        ? `${mgmt.startYear}${mgmt.endYear ? `–${mgmt.endYear}` : "–present"}`
        : "Unknown dates";
      const isCurrent = !mgmt.endYear;

      if (!existing || (isCurrent && !existing.isCurrent)) {
        landlordMap.set(mgmt.landlord.id, {
          id: mgmt.landlord.id,
          name: mgmt.landlord.name,
          company: mgmt.landlord.company,
          city: mgmt.landlord.city,
          isCurrent,
          years,
          propertyAddress: prop.address,
          reviewCount: prop._count.reviews,
        });
      }
    }
  }

  // Sort: current managers first, then by review count
  const suggestions = Array.from(landlordMap.values()).sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
    return b.reviewCount - a.reviewCount;
  });

  return NextResponse.json({
    properties: properties.map((p) => ({
      id: p.id,
      address: p.address,
      unit: p.unit,
      city: p.city,
      complexName: p.complexName,
      neighborhood: p.neighborhood,
    })),
    suggestions,
  });
}