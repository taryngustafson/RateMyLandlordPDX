# RateMyLandlordPDX

**Anonymous landlord reviews for the Portland, Oregon metro area.**

## Why This Exists

Portland has a serious rental affordability and landlord accountability problem. Tenants often have no way to know what they're getting into before signing a lease — and by the time they find out, they're locked in.

I built **RateMyLandlordPDX** to give tenants a shared place to warn each other about problem landlords and highlight the good ones. No account required, fully anonymous, and focused specifically on the Portland metro area.

## What It Does

- **Search landlords** by name, company, phone number, email, or property address
- **Write anonymous reviews** with ratings across 5 categories (overall, responsiveness, maintenance, fairness, communication)
- **Browse by city** across the Portland metro area (Portland, Beaverton, Gresham, Tigard, Lake Oswego, and more)
- **Recommended list** — landlords with high ratings and strong recommendation rates, ranked automatically
- **Caution list** — landlords with consistently poor reviews or red flag keywords (mold, deposit theft, harassment, etc.), auto-generated from review data
- **Tenant resources** — curated links to Oregon tenant rights organizations, free legal aid, how to report housing violations, and key Oregon landlord-tenant laws
- **Duplicate detection** — when adding a landlord, the app checks for existing entries to prevent duplicates
- **Alias matching** — landlords are searchable by all their known names (e.g., "Guardian" finds "Guardian Real Estate Services" / "Guardian Management LLC")

## Tech Stack

- **Next.js 16** (App Router) — full-stack React framework
- **React 19** — UI components
- **TypeScript** — type safety throughout
- **Tailwind CSS 4** — utility-first styling
- **Prisma 7** — database ORM and schema management
- **SQLite** (via better-sqlite3) — lightweight local database (production would use PostgreSQL)
- **Turbopack** — fast dev server bundling

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage — hero, search, stats, recent reviews
│   ├── search/page.tsx          # Search landlords with filters
│   ├── review/page.tsx          # Multi-step anonymous review form
│   ├── landlord/[id]/page.tsx   # Individual landlord profile
│   ├── add-landlord/page.tsx    # Add new landlord with duplicate detection
│   ├── recommended/page.tsx     # Top-rated landlords
│   ├── caution-list/page.tsx    # Flagged landlords
│   ├── resources/page.tsx       # Tenant rights & legal resources
│   └── api/                     # REST API routes
│       ├── landlords/           # CRUD + search
│       ├── reviews/             # Create & list reviews
│       ├── properties/          # Property management
│       └── address-lookup/      # Find landlords by address
├── components/
│   └── StarRating.tsx           # Reusable interactive star rating
└── lib/
    └── prisma.ts                # Database client singleton

prisma/
├── schema.prisma                # Database schema (5 models)
├── seed.ts                      # ~50 real Portland-area property managers
└── migrations/                  # Schema migration history
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up the database and run migrations
npx prisma migrate dev

# Seed with Portland-area landlord data
npm run seed

# Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## How It Was Built

Built with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) as a pair-programming collaborator. I made the product and architectural decisions, guided the implementation, debugged issues, and am actively learning the stack as I go.

## License

MIT
