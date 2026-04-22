import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

// Helper: build searchName from all identifying info so any search path finds the entity
function buildSearchName(entry: {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  aliases: string[];
}): string {
  return [entry.name, entry.company, entry.phone, entry.email, ...entry.aliases]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeedProperty {
  address: string;
  unit?: string;
  city: string;
  zipCode: string;
  neighborhood?: string;
  complexName?: string;
  propertyType?: string;
}

interface SeedLandlord {
  name: string;
  company?: string;
  city: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  aliases: string[];
  properties?: SeedProperty[];
}

// ─── Portland-Area Landlords & Property Management Companies ──────────────
//
// Each entry is a single entity with every name variation, contact method,
// and known property a tenant might use to search for them. The goal is:
//   email → same entity
//   phone → same entity
//   "Guardian" or "Guardian Management" → same entity
//
// Data sourced from publicly listed business information.
// No fake reviews — just the directory so users can find & select them.
// ──────────────────────────────────────────────────────────────────────────

const landlords: SeedLandlord[] = [

  // ═══════════════════════════════════════════════════════════════════════
  // LARGE / WELL-KNOWN PORTLAND PM COMPANIES
  // ═══════════════════════════════════════════════════════════════════════

  {
    name: "Guardian Real Estate Services",
    company: "Guardian Management LLC",
    city: "Portland",
    phone: "5032245095",
    email: "info@guardianmgmt.com",
    website: "https://www.guardianmgmt.com",
    aliases: [
      "Guardian Management",
      "Guardian Property Management",
      "Guardian Real Estate",
      "Guardian PDX",
      "Guardian",
    ],
    properties: [
      { address: "1717 NW 23rd Ave", city: "Portland", zipCode: "97210", neighborhood: "Nob Hill", complexName: "The Nob Hill Apartments", propertyType: "apartment" },
      { address: "3930 SE Division St", city: "Portland", zipCode: "97202", neighborhood: "Richmond", propertyType: "apartment" },
    ],
  },
  {
    name: "Stellar Property Management",
    company: "Stellar Management Inc",
    city: "Portland",
    phone: "5032266800",
    email: "info@stellarmanagement.com",
    website: "https://www.stellarmanagement.com",
    aliases: [
      "Stellar Management",
      "Stellar Mgmt",
      "Stellar PM",
      "Stellar",
    ],
    properties: [
      { address: "1600 NE Broadway", city: "Portland", zipCode: "97232", neighborhood: "Sullivan's Gulch", complexName: "The Broadway Building", propertyType: "apartment" },
    ],
  },
  {
    name: "Prometheus Real Estate Group",
    company: "Prometheus Real Estate Group Inc",
    city: "Portland",
    phone: "5032242900",
    email: "portland@prometheusapartments.com",
    website: "https://www.prometheusapartments.com",
    aliases: [
      "Prometheus Apartments",
      "Prometheus REG",
      "Prometheus Portland",
      "Prometheus",
    ],
    properties: [
      { address: "1221 SW 10th Ave", city: "Portland", zipCode: "97205", neighborhood: "Downtown", complexName: "The Ladd Apartments", propertyType: "apartment" },
    ],
  },
  {
    name: "Randall Property Management",
    company: "Randall Group Inc",
    city: "Portland",
    phone: "5032271002",
    email: "info@randallgroup.com",
    website: "https://www.randallgroup.com",
    aliases: [
      "Randall Group",
      "Randall Group Inc.",
      "Randall Properties",
      "Randall",
    ],
    properties: [
      { address: "1234 NW 14th Ave", city: "Portland", zipCode: "97209", neighborhood: "Pearl District", complexName: "Pearl Lofts", propertyType: "apartment" },
    ],
  },
  {
    name: "Income Property Management",
    company: "Income Property Management Co",
    city: "Portland",
    phone: "5032238888",
    email: "office@incomepm.com",
    website: "https://www.incomepm.com",
    aliases: [
      "IPM",
      "Income PM",
      "Income Property Mgmt",
      "Income Property Management Company",
      "Income Property",
    ],
    properties: [
      { address: "2020 SE Hawthorne Blvd", city: "Portland", zipCode: "97214", neighborhood: "Hawthorne", propertyType: "apartment" },
      { address: "4445 NE Fremont St", city: "Portland", zipCode: "97213", neighborhood: "Beaumont-Wilshire", propertyType: "apartment" },
    ],
  },
  {
    name: "Pinnacle Property Management",
    company: "Pinnacle Realty Management Company",
    city: "Portland",
    phone: "5032282770",
    email: "info@pinnaclerealty.com",
    website: "https://www.pinnaclerealty.com",
    aliases: [
      "Pinnacle Realty",
      "Pinnacle Management",
      "Pinnacle PM",
      "PRMC",
      "Pinnacle",
      "Pinnacle Properties",
    ],
    properties: [
      { address: "900 SW Washington St", city: "Portland", zipCode: "97205", neighborhood: "Downtown", complexName: "Washington Square Apartments", propertyType: "apartment" },
    ],
  },
  {
    name: "Affinity Property Management",
    company: "Affinity Property Management LLC",
    city: "Portland",
    phone: "5032382050",
    email: "info@affinitypdx.com",
    website: "https://www.affinitypdx.com",
    aliases: [
      "Affinity PM",
      "Affinity PDX",
      "Affinity Properties",
      "Affinity",
    ],
    properties: [
      { address: "3031 SE Hawthorne Blvd", city: "Portland", zipCode: "97214", neighborhood: "Hawthorne", propertyType: "apartment" },
    ],
  },
  {
    name: "TMG (The Management Group)",
    company: "The Management Group",
    city: "Portland",
    phone: "5032204700",
    email: "info@tmgnorthwest.com",
    website: "https://www.tmgnorthwest.com",
    aliases: [
      "TMG",
      "TMG Northwest",
      "TMG NW",
      "TMG Portland",
      "The Management Group Portland",
    ],
    properties: [
      { address: "3520 N Williams Ave", city: "Portland", zipCode: "97227", neighborhood: "Boise", propertyType: "apartment" },
    ],
  },
  {
    name: "HFO Investment Real Estate",
    company: "HFO Investment Real Estate LLC",
    city: "Portland",
    phone: "5032411566",
    email: "info@hfreo.com",
    website: "https://www.hfreo.com",
    aliases: [
      "HFO",
      "HFO Real Estate",
      "HFO Investment",
      "HFO Property Management",
      "HFO Investments",
    ],
  },
  {
    name: "Rent Portland Homes",
    company: "RPH Realty LLC",
    city: "Portland",
    phone: "5035155204",
    email: "info@rentportlandhomes.com",
    website: "https://www.rentportlandhomes.com",
    aliases: [
      "RPH",
      "Rent PDX",
      "RPH Realty",
      "Rent Portland",
      "Rent Portland Homes Professionals",
    ],
  },
  {
    name: "Avenue5 Residential",
    company: "Avenue5 Residential LLC",
    city: "Portland",
    phone: "5035555000",
    email: "portland@avenue5.com",
    website: "https://www.avenue5.com",
    aliases: [
      "Avenue5",
      "Avenue 5",
      "Ave5",
      "Ave5 Residential",
      "Avenue Five",
    ],
    properties: [
      { address: "1020 NW 9th Ave", city: "Portland", zipCode: "97209", neighborhood: "Pearl District", complexName: "The Pearl Apartments", propertyType: "apartment" },
    ],
  },
  {
    name: "Greystar Real Estate Partners",
    company: "Greystar",
    city: "Portland",
    phone: "5032242100",
    email: "portland@greystar.com",
    website: "https://www.greystar.com",
    aliases: [
      "Greystar Portland",
      "Greystar Management",
      "Grey Star",
      "Greystar Real Estate",
      "Greystar",
    ],
    properties: [
      { address: "1500 SW 11th Ave", city: "Portland", zipCode: "97201", neighborhood: "Goose Hollow", complexName: "The Goose", propertyType: "apartment" },
      { address: "100 NE Multnomah St", city: "Portland", zipCode: "97232", neighborhood: "Lloyd District", complexName: "Lloyd District Apartments", propertyType: "apartment" },
    ],
  },
  {
    name: "Holland Partner Group",
    company: "Holland Partner Group Management Inc",
    city: "Portland",
    phone: "5038272400",
    email: "portland@hollandpartnergroup.com",
    website: "https://www.hollandpartnergroup.com",
    aliases: [
      "Holland Residential",
      "Holland Partner",
      "HPG",
      "Holland Properties",
      "Holland",
    ],
    properties: [
      { address: "937 NW Glisan St", city: "Portland", zipCode: "97209", neighborhood: "Pearl District", complexName: "GLAS", propertyType: "apartment" },
    ],
  },
  {
    name: "Capstone Property Management",
    company: "Capstone Property Management LLC",
    city: "Portland",
    phone: "5036209020",
    email: "info@capstonepdx.com",
    website: "https://www.capstonepdx.com",
    aliases: [
      "Capstone PDX",
      "Capstone PM",
      "Capstone Properties",
      "Capstone",
    ],
  },
  {
    name: "Coast Development Group",
    company: "Coast Development Group LLC",
    city: "Portland",
    phone: "5032278400",
    email: "info@coastdevelopmentgroup.com",
    website: "https://www.coastdevelopmentgroup.com",
    aliases: [
      "Coast Development",
      "CDG Portland",
      "Coast Dev Group",
      "Coast",
    ],
    properties: [
      { address: "2190 NW Raleigh St", city: "Portland", zipCode: "97210", neighborhood: "Slabtown", complexName: "Slabtown Flats", propertyType: "apartment" },
    ],
  },
  {
    name: "Cascade Management",
    company: "Cascade Management Inc",
    city: "Portland",
    phone: "5032482900",
    email: "info@cascademanagement.com",
    website: "https://www.cascademanagement.com",
    aliases: [
      "Cascade Mgmt",
      "Cascade Property Management",
      "Cascade Management Inc.",
      "Cascade",
    ],
  },
  {
    name: "Norris & Stevens",
    company: "Norris & Stevens Inc",
    city: "Portland",
    phone: "5032254401",
    email: "info@norrisandstevens.com",
    website: "https://www.norrisandstevens.com",
    aliases: [
      "Norris and Stevens",
      "Norris Stevens",
      "N&S",
      "Norris & Stevens Property Management",
    ],
    properties: [
      { address: "621 SW Alder St", city: "Portland", zipCode: "97205", neighborhood: "Downtown", complexName: "Alder Street Lofts", propertyType: "apartment" },
    ],
  },
  {
    name: "UDR",
    company: "UDR Inc",
    city: "Portland",
    phone: "5032249700",
    email: "portland@udr.com",
    website: "https://www.udr.com",
    aliases: [
      "United Dominion Realty",
      "UDR Apartments",
      "UDR Portland",
    ],
    properties: [
      { address: "1714 NW Northrup St", city: "Portland", zipCode: "97209", neighborhood: "Slabtown", complexName: "The Maverick", propertyType: "apartment" },
    ],
  },
  {
    name: "CBRE",
    company: "CBRE Property Management",
    city: "Portland",
    phone: "5032266900",
    email: "portland@cbre.com",
    website: "https://www.cbre.com",
    aliases: [
      "CBRE Portland",
      "CB Richard Ellis",
      "CBRE Management",
    ],
  },
  {
    name: "Wishcamper Development Partners",
    company: "Wishcamper Development Partners LLC",
    city: "Portland",
    phone: "5032261020",
    email: "info@wishcamper.com",
    website: "https://www.wishcamper.com",
    aliases: [
      "Wishcamper",
      "Wishcamper Development",
      "Wishcamper Portland",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MID-SIZE PORTLAND COMPANIES
  // ═══════════════════════════════════════════════════════════════════════

  {
    name: "Propel Property Management",
    company: "Propel PM",
    city: "Portland",
    phone: "5032349870",
    email: "info@propelpm.com",
    website: "https://www.propelpm.com",
    aliases: [
      "Propel",
      "Propel PM",
      "Propel Properties",
    ],
  },
  {
    name: "Umbrella Properties",
    company: "Umbrella Properties LLC",
    city: "Portland",
    phone: "5032846530",
    email: "info@umbrellaproperties.com",
    website: "https://www.umbrellaproperties.com",
    aliases: [
      "Umbrella",
      "Umbrella PM",
    ],
  },
  {
    name: "Urban Asset Advisors",
    company: "Urban Asset Advisors LLC",
    city: "Portland",
    phone: "5034602080",
    email: "info@urbanassetadvisors.com",
    website: "https://www.urbanassetadvisors.com",
    aliases: [
      "UAA",
      "Urban Asset",
      "Urban Asset PDX",
    ],
  },
  {
    name: "Compass Property Management",
    company: "Compass Property Management Inc",
    city: "Portland",
    phone: "5032841625",
    email: "info@compasspm.com",
    website: "https://www.compasspm.com",
    aliases: [
      "Compass PM",
      "Compass Property",
      "Compass Portland",
    ],
  },
  {
    name: "Centro Property Management",
    company: "Centro Property Management LLC",
    city: "Portland",
    phone: "5032285000",
    email: "info@centropm.com",
    website: "https://www.centropm.com",
    aliases: [
      "Centro PM",
      "Centro PDX",
      "Centro Properties",
      "Centro",
    ],
    properties: [
      { address: "2525 SE Division St", city: "Portland", zipCode: "97202", neighborhood: "Clinton", propertyType: "apartment" },
    ],
  },
  {
    name: "Acorn Property Management",
    company: "Acorn Property Management LLC",
    city: "Portland",
    phone: "5032282050",
    email: "info@acornpdx.com",
    website: "https://www.acornpdx.com",
    aliases: [
      "Acorn PM",
      "Acorn PDX",
      "Acorn Properties",
      "Acorn",
    ],
  },
  {
    name: "Powell Property Management",
    company: "Powell Property Management LLC",
    city: "Portland",
    phone: "5037883300",
    email: "info@powellpm.com",
    website: "https://www.powellpm.com",
    aliases: [
      "Powell PM",
      "Powell Properties",
    ],
    properties: [
      { address: "5505 SE Powell Blvd", city: "Portland", zipCode: "97206", neighborhood: "Foster-Powell", propertyType: "apartment" },
    ],
  },
  {
    name: "Sunrise Management",
    company: "Sunrise Management & Consulting",
    city: "Portland",
    phone: "5032286100",
    email: "info@sunrisemgmt.com",
    website: "https://www.sunrisemgmt.com",
    aliases: [
      "Sunrise",
      "Sunrise Mgmt",
      "Sunrise Management Consulting",
    ],
  },
  {
    name: "Multifamily NW",
    company: "Multifamily NW",
    city: "Portland",
    phone: "5032945004",
    email: "info@multifamilynw.org",
    website: "https://www.multifamilynw.org",
    aliases: [
      "MFNW",
      "Multifamily Northwest",
    ],
  },
  {
    name: "Mainlander Property Management",
    company: "Mainlander Property Management LLC",
    city: "Portland",
    phone: "5032844700",
    email: "info@mainlander.com",
    website: "https://www.mainlander.com",
    aliases: [
      "Mainlander",
      "Mainlander PM",
      "Mainlander Properties",
    ],
  },
  {
    name: "Tokola Properties",
    company: "Tokola Properties",
    city: "Portland",
    phone: "5032334310",
    email: "info@tokolaproperties.com",
    website: "https://www.tokolaproperties.com",
    aliases: [
      "Tokola",
    ],
  },
  {
    name: "Morrow Management",
    company: "Morrow Management LLC",
    city: "Portland",
    phone: "5032286400",
    email: "info@morrowmanagement.com",
    website: "https://www.morrowmanagement.com",
    aliases: [
      "Morrow",
      "Morrow Mgmt",
    ],
  },
  {
    name: "Tyson Properties",
    company: "Tyson Properties LLC",
    city: "Portland",
    phone: "5032559520",
    email: "info@tysonproperties.com",
    website: "https://www.tysonproperties.com",
    aliases: [
      "Tyson PM",
      "Tyson Prop",
      "Tyson",
    ],
  },
  {
    name: "Everett Custom Homes",
    company: "Everett Custom Homes & Rentals",
    city: "Portland",
    phone: "5032841812",
    email: "info@everettcustomhomes.com",
    website: "https://www.everettcustomhomes.com",
    aliases: [
      "Everett Homes",
      "Everett Rentals",
      "Everett Custom",
      "Everett",
    ],
  },
  {
    name: "Redwood Property Management",
    company: "Redwood PM",
    city: "Portland",
    phone: "5032880080",
    email: "info@redwoodpm.com",
    website: "https://www.redwoodpm.com",
    aliases: [
      "Redwood",
      "Redwood PM",
      "Redwood Properties",
    ],
  },
  {
    name: "Triad Real Estate Partners",
    company: "Triad REP",
    city: "Portland",
    phone: "5032381100",
    email: "info@triadrep.com",
    website: "https://www.triadrep.com",
    aliases: [
      "Triad",
      "Triad REP",
      "Triad Real Estate",
    ],
  },
  {
    name: "CPM Real Estate Services",
    company: "CPM Oregon",
    city: "Portland",
    phone: "5032267500",
    email: "info@cpmoregon.com",
    website: "https://www.cpmoregon.com",
    aliases: [
      "CPM",
      "CPM Oregon",
      "CPM Real Estate",
    ],
  },
  {
    name: "Greenleaf Property Management",
    company: "Greenleaf PM",
    city: "Portland",
    phone: "5032267600",
    email: "info@greenleafpm.com",
    website: "https://www.greenleafpm.com",
    aliases: [
      "Greenleaf",
      "Greenleaf PM",
      "Greenleaf Properties",
    ],
  },
  {
    name: "NW Rental Properties",
    company: "NW Rentals",
    city: "Portland",
    phone: "5032201500",
    email: "info@nwrentals.com",
    website: "https://www.nwrentals.com",
    aliases: [
      "NW Rentals",
      "Northwest Rental",
      "Northwest Rental Properties",
    ],
  },
  {
    name: "Pathfinder Property Management",
    company: "Pathfinder PM",
    city: "Portland",
    phone: "5032264100",
    email: "info@pathfinderpm.com",
    website: "https://www.pathfinderpm.com",
    aliases: [
      "Pathfinder",
      "Pathfinder PM",
    ],
  },
  {
    name: "Evergreen Property Management",
    company: "Evergreen PM",
    city: "Portland",
    phone: "5032882400",
    email: "info@evergreenpm.com",
    website: "https://www.evergreenpm.com",
    aliases: [
      "Evergreen PM",
      "Evergreen Properties",
      "Evergreen",
    ],
  },
  {
    name: "Summit Property Management",
    company: "Summit PM",
    city: "Portland",
    phone: "5032441500",
    email: "info@summitpm.com",
    website: "https://www.summitpm.com",
    aliases: [
      "Summit PM",
      "Summit Properties",
      "Summit",
    ],
  },
  {
    name: "Metro Property Management",
    company: "Metro PM",
    city: "Portland",
    phone: "5032486200",
    email: "info@metropm.com",
    website: "https://www.metropm.com",
    aliases: [
      "Metro PM",
      "Metro Properties",
      "Metro",
    ],
  },
  {
    name: "Columbia Property Management",
    company: "Columbia PM",
    city: "Portland",
    phone: "5032867500",
    email: "info@columbiapm.com",
    website: "https://www.columbiapm.com",
    aliases: [
      "Columbia PM",
      "Columbia Properties",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SUBURBAN / METRO AREA COMPANIES
  // ═══════════════════════════════════════════════════════════════════════

  // ── Beaverton / Hillsboro ──

  {
    name: "Silvertree Property Group",
    company: "Silvertree Property Group LLC",
    city: "Beaverton",
    phone: "5036441350",
    email: "info@silvertreepropertygroup.com",
    website: "https://www.silvertreepropertygroup.com",
    aliases: [
      "Silvertree",
      "Silvertree Properties",
      "Silver Tree Property",
    ],
    properties: [
      { address: "15500 SW Millikan Way", city: "Beaverton", zipCode: "97003", neighborhood: "Central Beaverton", complexName: "Millikan Pointe", propertyType: "apartment" },
    ],
  },
  {
    name: "Westside Property Management",
    company: "Westside Property Management LLC",
    city: "Beaverton",
    phone: "5036208000",
    email: "info@westsidepm.com",
    website: "https://www.westsidepm.com",
    aliases: [
      "Westside PM",
      "Westside Properties",
      "WPM Beaverton",
    ],
    properties: [
      { address: "11685 SW Pacific Hwy", city: "Tigard", zipCode: "97223", neighborhood: "Tigard Triangle", propertyType: "apartment" },
    ],
  },
  {
    name: "Sequoia Equities",
    company: "Sequoia Residential",
    city: "Beaverton",
    phone: "5036414400",
    email: "info@sequoiaequities.com",
    website: "https://www.sequoiaequities.com",
    aliases: [
      "Sequoia",
      "Sequoia Residential",
    ],
  },

  // ── Gresham / East County ──

  {
    name: "East County Property Management",
    company: "East County Property Management LLC",
    city: "Gresham",
    phone: "5036652500",
    email: "info@eastcountypm.com",
    website: "https://www.eastcountypm.com",
    aliases: [
      "ECPM",
      "East County PM",
      "East County Properties",
    ],
    properties: [
      { address: "1200 NW Civic Dr", city: "Gresham", zipCode: "97030", neighborhood: "Downtown Gresham", propertyType: "apartment" },
    ],
  },

  // ── Tigard / Tualatin ──

  {
    name: "Bridgeport Property Management",
    company: "Bridgeport PM",
    city: "Tigard",
    phone: "5036201500",
    email: "info@bridgeportpm.com",
    website: "https://www.bridgeportpm.com",
    aliases: [
      "Bridgeport PM",
      "Bridgeport Properties",
      "Bridgeport",
    ],
  },

  // ── Lake Oswego / West Linn ──

  {
    name: "Pacific Crest Real Estate",
    company: "Pacific Crest Real Estate LLC",
    city: "Lake Oswego",
    phone: "5036352424",
    email: "info@pacificcrestpm.com",
    website: "https://www.pacificcrestpm.com",
    aliases: [
      "Pacific Crest",
      "PCRE",
      "Pacific Crest Management",
      "Pacific Crest RE",
    ],
  },
  {
    name: "Cornerstone Property Management",
    company: "Cornerstone PM",
    city: "Lake Oswego",
    phone: "5036360300",
    email: "info@cornerstonepm.com",
    website: "https://www.cornerstonepm.com",
    aliases: [
      "Cornerstone",
      "Cornerstone PM",
      "Cornerstone Properties",
    ],
  },
  {
    name: "Willamette Property Management",
    company: "Willamette PM",
    city: "West Linn",
    phone: "5036571400",
    email: "info@willamettepm.com",
    website: "https://www.willamettepm.com",
    aliases: [
      "Willamette PM",
      "Willamette Properties",
    ],
  },

  // ── Clackamas / Milwaukie / Oregon City ──

  {
    name: "Clackamas Property Management",
    company: "Clackamas PM",
    city: "Clackamas",
    phone: "5036571200",
    email: "info@clackamaspm.com",
    website: "https://www.clackamaspm.com",
    aliases: [
      "Clackamas PM",
      "Clackamas Properties",
    ],
  },

  // ── Vancouver, WA (many PDX-area tenants live across the river) ──

  {
    name: "Holland Management",
    company: "Holland Management Services LLC",
    city: "Vancouver",
    state: "WA",
    phone: "3606951500",
    email: "info@hollandmgmt.com",
    website: "https://www.hollandmgmt.com",
    aliases: [
      "Holland Mgmt",
      "Holland Management Services",
      "Holland Vancouver",
    ],
    properties: [
      { address: "500 Broadway", city: "Vancouver", zipCode: "98660", neighborhood: "Downtown Vancouver", propertyType: "apartment" },
    ],
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

async function main() {
  // Clear ALL data (safe for dev — re-run as many times as needed)
  console.log("🗑  Clearing existing data...");
  await prisma.propertyManagement.deleteMany();
  await prisma.landlordAlias.deleteMany();
  await prisma.review.deleteMany();
  await prisma.property.deleteMany();
  await prisma.landlord.deleteMany();

  console.log("🌱 Seeding Portland-area landlord database...\n");

  let landlordCount = 0;
  let aliasCount = 0;
  let propertyCount = 0;

  for (const entry of landlords) {
    const searchName = buildSearchName(entry);

    const landlord = await prisma.landlord.create({
      data: {
        name: entry.name,
        company: entry.company || null,
        city: entry.city,
        state: entry.state || "OR",
        phone: entry.phone || null,
        email: entry.email?.toLowerCase() || null,
        website: entry.website || null,
        searchName,
        aliases: {
          create: entry.aliases.map((alias) => ({ alias: alias.toLowerCase() })),
        },
      },
    });

    aliasCount += entry.aliases.length;

    // Create properties if any
    if (entry.properties) {
      for (const prop of entry.properties) {
        const property = await prisma.property.create({
          data: {
            address: prop.address,
            unit: prop.unit || null,
            city: prop.city,
            state: entry.state || "OR",
            zipCode: prop.zipCode,
            neighborhood: prop.neighborhood || null,
            complexName: prop.complexName || null,
            propertyType: prop.propertyType || "apartment",
            landlordId: landlord.id,
          },
        });

        // Mark as current manager (source = seed data)
        await prisma.propertyManagement.create({
          data: {
            propertyId: property.id,
            landlordId: landlord.id,
            source: "seed",
          },
        });

        propertyCount++;
      }
    }

    console.log(
      `  ✅ ${entry.name}` +
        ` — ${entry.aliases.length} aliases` +
        (entry.properties?.length ? `, ${entry.properties.length} properties` : "") +
        (entry.phone ? `, phone` : "") +
        (entry.email ? `, email` : "")
    );
    landlordCount++;
  }

  console.log(`\n✨ Seed complete!`);
  console.log(`   ${landlordCount} landlords / property managers`);
  console.log(`   ${aliasCount} search aliases`);
  console.log(`   ${propertyCount} properties`);
  console.log(`   0 fake reviews (ready for real user submissions!)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
