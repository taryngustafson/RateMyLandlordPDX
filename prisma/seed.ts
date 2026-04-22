import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Helper: build searchName from all identifying info so any search path finds the entity
function buildSearchName(entry: {
  name: string;
  company?: string;
  aliases: string[];
}): string {
  return [entry.name, entry.company, ...entry.aliases]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeedLandlord {
  name: string;
  company?: string;
  city: string;
  state?: string;
  aliases: string[];
}

// ─── Portland-Area Landlords & Property Management Companies ──────────────
//
// Company names and aliases only. No contact info or addresses — those
// should come from verified user submissions.
// ──────────────────────────────────────────────────────────────────────────

const landlords: SeedLandlord[] = [

  // ═══════════════════════════════════════════════════════════════════════
  // LARGE / WELL-KNOWN PORTLAND PM COMPANIES
  // ═══════════════════════════════════════════════════════════════════════

  {
    name: "Guardian Real Estate Services",
    company: "Guardian Management LLC",
    city: "Portland",
    aliases: [
      "Guardian Management",
      "Guardian Property Management",
      "Guardian Real Estate",
      "Guardian PDX",
      "Guardian",
    ],
  },
  {
    name: "Stellar Property Management",
    company: "Stellar Management Inc",
    city: "Portland",
    aliases: ["Stellar Management", "Stellar Mgmt", "Stellar PM", "Stellar"],
  },
  { name: "Prometheus Real Estate Group", company: "Prometheus Real Estate Group Inc", city: "Portland", aliases: ["Prometheus Apartments", "Prometheus REG", "Prometheus Portland", "Prometheus"] },
  { name: "Randall Property Management", company: "Randall Group Inc", city: "Portland", aliases: ["Randall Group", "Randall Group Inc.", "Randall Properties", "Randall"] },
  { name: "Income Property Management", company: "Income Property Management Co", city: "Portland", aliases: ["IPM", "Income PM", "Income Property Mgmt", "Income Property Management Company", "Income Property"] },
  { name: "Pinnacle Property Management", company: "Pinnacle Realty Management Company", city: "Portland", aliases: ["Pinnacle Realty", "Pinnacle Management", "Pinnacle PM", "PRMC", "Pinnacle", "Pinnacle Properties"] },
  { name: "Affinity Property Management", company: "Affinity Property Management LLC", city: "Portland", aliases: ["Affinity PM", "Affinity PDX", "Affinity Properties", "Affinity"] },
  { name: "TMG (The Management Group)", company: "The Management Group", city: "Portland", aliases: ["TMG", "TMG Northwest", "TMG NW", "TMG Portland", "The Management Group Portland"] },
  { name: "HFO Investment Real Estate", company: "HFO Investment Real Estate LLC", city: "Portland", aliases: ["HFO", "HFO Real Estate", "HFO Investment", "HFO Property Management", "HFO Investments"] },
  { name: "Rent Portland Homes", company: "RPH Realty LLC", city: "Portland", aliases: ["RPH", "Rent PDX", "RPH Realty", "Rent Portland", "Rent Portland Homes Professionals"] },
  { name: "Avenue5 Residential", company: "Avenue5 Residential LLC", city: "Portland", aliases: ["Avenue5", "Avenue 5", "Ave5", "Ave5 Residential", "Avenue Five"] },
  { name: "Greystar Real Estate Partners", company: "Greystar", city: "Portland", aliases: ["Greystar Portland", "Greystar Management", "Grey Star", "Greystar Real Estate", "Greystar"] },
  { name: "Holland Partner Group", company: "Holland Partner Group Management Inc", city: "Portland", aliases: ["Holland Residential", "Holland Partner", "HPG", "Holland Properties", "Holland"] },
  { name: "Capstone Property Management", company: "Capstone Property Management LLC", city: "Portland", aliases: ["Capstone PDX", "Capstone PM", "Capstone Properties", "Capstone"] },
  { name: "Coast Development Group", company: "Coast Development Group LLC", city: "Portland", aliases: ["Coast Development", "CDG Portland", "Coast Dev Group", "Coast"] },
  { name: "Cascade Management", company: "Cascade Management Inc", city: "Portland", aliases: ["Cascade Mgmt", "Cascade Property Management", "Cascade Management Inc.", "Cascade"] },
  { name: "Norris & Stevens", company: "Norris & Stevens Inc", city: "Portland", aliases: ["Norris and Stevens", "Norris Stevens", "N&S", "Norris & Stevens Property Management"] },
  { name: "UDR", company: "UDR Inc", city: "Portland", aliases: ["United Dominion Realty", "UDR Apartments", "UDR Portland"] },
  { name: "CBRE", company: "CBRE Property Management", city: "Portland", aliases: ["CBRE Portland", "CB Richard Ellis", "CBRE Management"] },
  { name: "Wishcamper Development Partners", company: "Wishcamper Development Partners LLC", city: "Portland", aliases: ["Wishcamper", "Wishcamper Development", "Wishcamper Portland"] },

  // ═══════════════════════════════════════════════════════════════════════
  // MID-SIZE PORTLAND COMPANIES
  // ═══════════════════════════════════════════════════════════════════════

  { name: "Propel Property Management", company: "Propel PM", city: "Portland", aliases: ["Propel", "Propel PM", "Propel Properties"] },
  { name: "Umbrella Properties", company: "Umbrella Properties LLC", city: "Portland", aliases: ["Umbrella", "Umbrella PM"] },
  { name: "Urban Asset Advisors", company: "Urban Asset Advisors LLC", city: "Portland", aliases: ["UAA", "Urban Asset", "Urban Asset PDX"] },
  { name: "Compass Property Management", company: "Compass Property Management Inc", city: "Portland", aliases: ["Compass PM", "Compass Property", "Compass Portland"] },
  { name: "Centro Property Management", company: "Centro Property Management LLC", city: "Portland", aliases: ["Centro PM", "Centro PDX", "Centro Properties", "Centro"] },
  { name: "Acorn Property Management", company: "Acorn Property Management LLC", city: "Portland", aliases: ["Acorn PM", "Acorn PDX", "Acorn Properties", "Acorn"] },
  { name: "Powell Property Management", company: "Powell Property Management LLC", city: "Portland", aliases: ["Powell PM", "Powell Properties"] },
  { name: "Sunrise Management", company: "Sunrise Management & Consulting", city: "Portland", aliases: ["Sunrise", "Sunrise Mgmt", "Sunrise Management Consulting"] },
  { name: "Multifamily NW", company: "Multifamily NW", city: "Portland", aliases: ["MFNW", "Multifamily Northwest"] },
  { name: "Mainlander Property Management", company: "Mainlander Property Management LLC", city: "Portland", aliases: ["Mainlander", "Mainlander PM", "Mainlander Properties"] },
  { name: "Tokola Properties", company: "Tokola Properties", city: "Portland", aliases: ["Tokola"] },
  { name: "Morrow Management", company: "Morrow Management LLC", city: "Portland", aliases: ["Morrow", "Morrow Mgmt"] },
  { name: "Tyson Properties", company: "Tyson Properties LLC", city: "Portland", aliases: ["Tyson PM", "Tyson Prop", "Tyson"] },
  { name: "Everett Custom Homes", company: "Everett Custom Homes & Rentals", city: "Portland", aliases: ["Everett Homes", "Everett Rentals", "Everett Custom", "Everett"] },
  { name: "Redwood Property Management", company: "Redwood PM", city: "Portland", aliases: ["Redwood", "Redwood PM", "Redwood Properties"] },
  { name: "Triad Real Estate Partners", company: "Triad REP", city: "Portland", aliases: ["Triad", "Triad REP", "Triad Real Estate"] },
  { name: "CPM Real Estate Services", company: "CPM Oregon", city: "Portland", aliases: ["CPM", "CPM Oregon", "CPM Real Estate"] },
  { name: "Greenleaf Property Management", company: "Greenleaf PM", city: "Portland", aliases: ["Greenleaf", "Greenleaf PM", "Greenleaf Properties"] },
  { name: "NW Rental Properties", company: "NW Rentals", city: "Portland", aliases: ["NW Rentals", "Northwest Rental", "Northwest Rental Properties"] },
  { name: "Pathfinder Property Management", company: "Pathfinder PM", city: "Portland", aliases: ["Pathfinder", "Pathfinder PM"] },
  { name: "Evergreen Property Management", company: "Evergreen PM", city: "Portland", aliases: ["Evergreen PM", "Evergreen Properties", "Evergreen"] },
  { name: "Summit Property Management", company: "Summit PM", city: "Portland", aliases: ["Summit PM", "Summit Properties", "Summit"] },
  { name: "Metro Property Management", company: "Metro PM", city: "Portland", aliases: ["Metro PM", "Metro Properties", "Metro"] },
  { name: "Columbia Property Management", company: "Columbia PM", city: "Portland", aliases: ["Columbia PM", "Columbia Properties"] },

  // ═══════════════════════════════════════════════════════════════════════
  // SUBURBAN / METRO AREA COMPANIES
  // ═══════════════════════════════════════════════════════════════════════

  { name: "Silvertree Property Group", company: "Silvertree Property Group LLC", city: "Beaverton", aliases: ["Silvertree", "Silvertree Properties", "Silver Tree Property"] },
  { name: "Westside Property Management", company: "Westside Property Management LLC", city: "Beaverton", aliases: ["Westside PM", "Westside Properties", "WPM Beaverton"] },
  { name: "Sequoia Equities", company: "Sequoia Residential", city: "Beaverton", aliases: ["Sequoia", "Sequoia Residential"] },
  { name: "East County Property Management", company: "East County Property Management LLC", city: "Gresham", aliases: ["ECPM", "East County PM", "East County Properties"] },
  { name: "Bridgeport Property Management", company: "Bridgeport PM", city: "Tigard", aliases: ["Bridgeport PM", "Bridgeport Properties", "Bridgeport"] },
  { name: "Pacific Crest Real Estate", company: "Pacific Crest Real Estate LLC", city: "Lake Oswego", aliases: ["Pacific Crest", "PCRE", "Pacific Crest Management", "Pacific Crest RE"] },
  { name: "Cornerstone Property Management", company: "Cornerstone PM", city: "Lake Oswego", aliases: ["Cornerstone", "Cornerstone PM", "Cornerstone Properties"] },
  { name: "Willamette Property Management", company: "Willamette PM", city: "West Linn", aliases: ["Willamette PM", "Willamette Properties"] },
  { name: "Clackamas Property Management", company: "Clackamas PM", city: "Clackamas", aliases: ["Clackamas PM", "Clackamas Properties"] },
  { name: "Holland Management", company: "Holland Management Services LLC", city: "Vancouver", state: "WA", aliases: ["Holland Mgmt", "Holland Management Services", "Holland Vancouver"] },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

async function main() {
  console.log("🗑  Clearing existing data...");
  await prisma.propertyManagement.deleteMany();
  await prisma.landlordAlias.deleteMany();
  await prisma.review.deleteMany();
  await prisma.property.deleteMany();
  await prisma.landlord.deleteMany();

  console.log("🌱 Seeding Portland-area landlord database...\n");

  let landlordCount = 0;
  let aliasCount = 0;

  for (const entry of landlords) {
    const searchName = buildSearchName(entry);

    await prisma.landlord.create({
      data: {
        name: entry.name,
        company: entry.company || null,
        city: entry.city,
        state: entry.state || "OR",
        searchName,
        aliases: {
          create: entry.aliases.map((alias) => ({ alias: alias.toLowerCase() })),
        },
      },
    });

    aliasCount += entry.aliases.length;
    console.log(`  ✅ ${entry.name} — ${entry.aliases.length} aliases`);
    landlordCount++;
  }

  console.log(`\n✨ Seed complete!`);
  console.log(`   ${landlordCount} landlords / property managers`);
  console.log(`   ${aliasCount} search aliases`);
  console.log(`   No contact info or addresses — those come from real users!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
