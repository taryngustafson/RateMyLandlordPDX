import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tenant Resources — RateMyLandlordPDX",
  description:
    "Know your rights as a Portland tenant. Legal resources, tenant organizations, and how to report housing violations.",
};

const RESOURCES = [
  {
    category: "Tenant Rights Organizations",
    icon: "⚖️",
    items: [
      {
        name: "Community Alliance of Tenants (CAT)",
        description:
          "Oregon's only statewide renter-rights organization. Offers a Renter Rights Hotline, tenant education workshops, and community organizing support.",
        url: "https://www.oregoncat.org",
        phone: "503-460-9702",
        highlight: "Free Renter Rights Hotline",
      },
      {
        name: "Portland Tenants United",
        description:
          "Grassroots tenant advocacy group focused on Portland. Organizes tenant unions, campaigns for policy changes, and provides mutual aid.",
        url: "https://www.pdxtu.org",
        highlight: "Tenant union organizing",
      },
      {
        name: "Oregon Renters Alliance",
        description:
          "Statewide coalition advocating for renter protections at the legislative level. Works on rent stabilization, just cause eviction, and tenant screening reform.",
        url: "https://www.oregonrentersalliance.com",
        highlight: "Legislative advocacy",
      },
    ],
  },
  {
    category: "Legal Aid & Free Legal Help",
    icon: "📋",
    items: [
      {
        name: "Legal Aid Services of Oregon (LASO)",
        description:
          "Free civil legal services for low-income Oregonians. Handles eviction defense, habitability complaints, deposit disputes, and discrimination cases.",
        url: "https://lasoregon.org",
        phone: "503-224-4086",
        highlight: "Free legal representation for qualifying tenants",
      },
      {
        name: "Oregon Law Center",
        description:
          "Provides free legal help to low-income tenants across Oregon. Specializes in housing law, fair housing, and public benefits.",
        url: "https://www.oregonlawcenter.org",
        phone: "503-473-8321",
        highlight: "Housing law specialists",
      },
      {
        name: "Oregon State Bar Lawyer Referral Service",
        description:
          "Get a 30-minute consultation with a lawyer for $35. Can help with lease disputes, wrongful eviction, and deposit recovery.",
        url: "https://www.osbar.org/public/ris/",
        phone: "503-684-3763",
        highlight: "$35 consultations",
      },
      {
        name: "Multnomah County Legal Aid",
        description:
          "Court-based legal assistance for eviction cases in Multnomah County. Walk-in help available at the courthouse.",
        url: "https://www.multco.us/",
        highlight: "Walk-in eviction defense help",
      },
    ],
  },
  {
    category: "Report Housing Violations",
    icon: "🚨",
    items: [
      {
        name: "Portland Housing Bureau — Rental Services",
        description:
          "File complaints about habitability issues, illegal rent increases, or landlord violations of Portland's rental regulations. Handles RRIO (Rental Registration) enforcement.",
        url: "https://www.portland.gov/phb/rental-services",
        phone: "503-823-1303",
        highlight: "Official city complaint process",
      },
      {
        name: "Oregon Bureau of Labor & Industries (BOLI) — Fair Housing",
        description:
          "File discrimination complaints based on race, color, religion, sex, disability, familial status, national origin, source of income, or sexual orientation.",
        url: "https://www.oregon.gov/boli/civil-rights/pages/filing-a-complaint.aspx",
        phone: "971-245-3844",
        highlight: "Housing discrimination complaints",
      },
      {
        name: "Multnomah County Code Enforcement",
        description:
          "Report unsafe housing conditions, building code violations, and health hazards. Inspectors can order landlords to make repairs.",
        url: "https://www.multco.us/",
        phone: "503-823-2404",
        highlight: "Building safety inspections",
      },
      {
        name: "Oregon Department of Justice — Consumer Protection",
        description:
          "File complaints about deceptive business practices by landlords or property management companies. Covers deposit theft, fraud, and unfair lease terms.",
        url: "https://www.doj.state.or.us/consumer-protection/",
        phone: "877-877-9392",
        highlight: "Deposit theft & fraud complaints",
      },
    ],
  },
  {
    category: "Know Your Rights — Oregon Tenant Law",
    icon: "📖",
    items: [
      {
        name: "Oregon Residential Landlord-Tenant Act (ORS 90)",
        description:
          "The full text of Oregon's landlord-tenant law. Covers security deposits, repairs, notices, evictions, and more. This is the law that governs your lease.",
        url: "https://www.oregonlegislature.gov/bills_laws/ors/ors090.html",
        highlight: "The actual law",
      },
      {
        name: "Portland Renter Protections",
        description:
          "Portland has additional protections beyond state law: relocation assistance for no-cause evictions, mandatory RRIO inspections, and screening criteria limits.",
        url: "https://www.portland.gov/phb/rental-services/renter-protections",
        highlight: "Portland-specific protections",
      },
      {
        name: "Security Deposit Rules (ORS 90.300)",
        description:
          "Landlords must return your deposit within 31 days of move-out with an itemized statement. They can only deduct for actual damages beyond normal wear and tear.",
        url: "https://www.oregonlegislature.gov/bills_laws/ors/ors090.html",
        highlight: "31-day return rule",
      },
      {
        name: "Repair Rights — Habitability Standards",
        description:
          "Your landlord must maintain the property in habitable condition. If they don't, you may have the right to repair and deduct, escrow rent, or terminate your lease.",
        url: "https://lasoregon.org",
        highlight: "Repair & deduct rights",
      },
    ],
  },
  {
    category: "Emergency & Crisis Resources",
    icon: "🆘",
    items: [
      {
        name: "211info — Housing Crisis Line",
        description:
          "Call 211 for immediate help with housing emergencies, eviction prevention, utility assistance, and shelter referrals. Available 24/7.",
        url: "https://www.211info.org",
        phone: "211",
        highlight: "24/7 crisis line",
      },
      {
        name: "Multnomah County Eviction Prevention",
        description:
          "Emergency rental assistance and eviction prevention services for Multnomah County residents facing housing instability.",
        url: "https://www.multco.us/",
        highlight: "Emergency rental assistance",
      },
      {
        name: "Fair Housing Council of Oregon",
        description:
          "Free fair housing testing, education, and complaint assistance. If you believe you've been discriminated against, they can investigate.",
        url: "https://www.fhco.org",
        phone: "503-223-8197",
        highlight: "Discrimination investigation",
      },
    ],
  },
];

const QUICK_TIPS = [
  {
    title: "Document Everything",
    tip: "Take photos/videos at move-in and move-out. Save all texts, emails, and letters from your landlord. Keep copies of maintenance requests.",
  },
  {
    title: "Know Your Deposit Rights",
    tip: "Oregon law requires landlords to return your deposit within 31 days with an itemized list of deductions. They can't charge for normal wear and tear.",
  },
  {
    title: "Request Repairs in Writing",
    tip: "Always submit maintenance requests in writing (email or text). This creates a paper trail. Landlords must make repairs within a reasonable time.",
  },
  {
    title: "Rent Increases Require Notice",
    tip: "In Oregon, landlords must give 90 days' notice for rent increases over 10% (or 7% + CPI). Portland has additional relocation assistance requirements.",
  },
  {
    title: "You Can't Be Retaliated Against",
    tip: "It's illegal for a landlord to raise rent, decrease services, or evict you for filing a complaint, joining a tenant organization, or exercising your legal rights.",
  },
  {
    title: "Illegal Entry",
    tip: "Your landlord must give at least 24 hours' written notice before entering your unit, except in emergencies. They can only enter at reasonable times.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Tenant Resources</h1>
      <p className="text-gray-500 mb-8">
        Know your rights as a Portland-area renter. Free legal help, tenant
        organizations, and how to report violations.
      </p>

      {/* Quick Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold text-emerald-800 mb-4">
          💡 Quick Tips for Portland Renters
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {QUICK_TIPS.map((tip) => (
            <div key={tip.title} className="bg-white rounded-lg p-4 border border-emerald-100">
              <h3 className="font-semibold text-sm text-emerald-700 mb-1">
                {tip.title}
              </h3>
              <p className="text-sm text-gray-600">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Sections */}
      {RESOURCES.map((section) => (
        <div key={section.category} className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>{section.icon}</span>
            {section.category}
          </h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div
                key={item.name}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                    {item.highlight && (
                      <span className="inline-block mt-2 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                        ⭐ {item.highlight}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 md:items-end shrink-0">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-center"
                      >
                        Visit Website →
                      </a>
                    )}
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                      >
                        📞 {item.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold mb-2">
          Had a bad experience with a landlord?
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Your anonymous review helps other tenants and builds a record of
          landlord behavior patterns.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/review"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
          >
            Write a Review
          </Link>
          <Link
            href="/caution-list"
            className="bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm"
          >
            View Caution List
          </Link>
        </div>
      </div>
    </div>
  );
}