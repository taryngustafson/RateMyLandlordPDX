import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const sortBy = searchParams.get("sort") || "name";

  const where: Record<string, unknown> = {};

  if (query) {
    const phoneDigits = query.replace(/\D/g, "");
    const isPhoneSearch = phoneDigits.length >= 7;
    const isEmailSearch = query.includes("@");

    where.OR = [
      { name: { contains: query } },
      { company: { contains: query } },
      { searchName: { contains: query.toLowerCase() } },
      ...(isPhoneSearch ? [{ phone: { contains: phoneDigits } }] : []),
      ...(isEmailSearch ? [{ email: { contains: query.toLowerCase() } }] : []),
    ];
  }

  if (city) {
    where.city = { contains: city };
  }

  const [landlords, total] = await Promise.all([
    prisma.landlord.findMany({
      where,
      include: {
        properties: true,
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
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy === "reviews" ? { reviews: { _count: "desc" } } : { name: "asc" },
    }),
    prisma.landlord.count({ where }),
  ]);

  const landlordsWithStats = landlords.map((landlord) => {
    const reviewCount = landlord.reviews.length;
    const avgOverall =
      reviewCount > 0
        ? landlord.reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
        : 0;
    const recommendPct =
      reviewCount > 0
        ? (landlord.reviews.filter((r) => r.wouldRecommend).length / reviewCount) * 100
        : 0;

    return {
      id: landlord.id,
      name: landlord.name,
      company: landlord.company,
      city: landlord.city,
      state: landlord.state,
      propertyCount: landlord.properties.length,
      reviewCount,
      avgOverall: Math.round(avgOverall * 10) / 10,
      recommendPct: Math.round(recommendPct),
    };
  });

  return NextResponse.json({
    landlords: landlordsWithStats,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, company, city, state, phone, email, website } = body;

  if (!name || !city) {
    return NextResponse.json(
      { error: "Name and city are required" },
      { status: 400 }
    );
  }

  const normalizedPhone = phone ? phone.replace(/\D/g, "") : null;
  const searchName = [name, company, normalizedPhone, email].filter(Boolean).join(" ").toLowerCase();

  const landlord = await prisma.landlord.create({
    data: {
      name,
      company: company || null,
      city,
      state: state || "OR",
      phone: normalizedPhone,
      email: email?.toLowerCase() || null,
      website: website || null,
      searchName,
    },
  });

  return NextResponse.json(landlord, { status: 201 });
}