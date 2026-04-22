import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fuzzy search for landlords — used for autocomplete and deduplication
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim() || "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const searchTerm = q.toLowerCase();

  // Normalize phone search (strip non-digits)
  const phoneDigits = searchTerm.replace(/\D/g, "");
  const isPhoneSearch = phoneDigits.length >= 7;
  const isEmailSearch = searchTerm.includes("@");

  // Search across name, company, aliases, searchName, phone, email
  const landlords = await prisma.landlord.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm } },
        { company: { contains: searchTerm } },
        { searchName: { contains: searchTerm } },
        { aliases: { some: { alias: { contains: searchTerm } } } },
        ...(isPhoneSearch ? [{ phone: { contains: phoneDigits } }] : []),
        ...(isEmailSearch ? [{ email: { contains: searchTerm } }] : []),
      ],
    },
    include: {
      aliases: { select: { alias: true } },
      _count: { select: { reviews: true, properties: true } },
      reviews: {
        select: { overallRating: true },
      },
    },
    take: 10,
    orderBy: { reviews: { _count: "desc" } },
  });

  const results = landlords.map((l) => {
    const avgRating =
      l.reviews.length > 0
        ? l.reviews.reduce((s, r) => s + r.overallRating, 0) / l.reviews.length
        : 0;

    // Calculate match quality for sorting
    const nameLower = l.name.toLowerCase();
    const companyLower = (l.company || "").toLowerCase();
    let matchType = "partial";
    if (nameLower === searchTerm || companyLower === searchTerm) {
      matchType = "exact";
    } else if (nameLower.startsWith(searchTerm) || companyLower.startsWith(searchTerm)) {
      matchType = "prefix";
    }

    return {
      id: l.id,
      name: l.name,
      company: l.company,
      city: l.city,
      state: l.state,
      aliases: l.aliases.map((a) => a.alias),
      reviewCount: l._count.reviews,
      propertyCount: l._count.properties,
      avgRating: Math.round(avgRating * 10) / 10,
      matchType,
    };
  });

  // Sort: exact > prefix > partial, then by review count
  results.sort((a, b) => {
    const matchOrder = { exact: 0, prefix: 1, partial: 2 };
    const aOrder = matchOrder[a.matchType as keyof typeof matchOrder];
    const bOrder = matchOrder[b.matchType as keyof typeof matchOrder];
    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.reviewCount - a.reviewCount;
  });

  return NextResponse.json(results);
}