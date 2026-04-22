import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RateMy Landlord PDX — Anonymous Landlord Reviews for Portland, OR",
  description:
    "Anonymously review and search landlords in the Portland, Oregon metro area. Share your rental experience to help fellow tenants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col text-gray-900 min-w-0 overflow-x-hidden">
        {/* Navigation */}
        <header className="bg-emerald-950 text-white shadow-md">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                RateMyLandlord<span className="text-emerald-300">PDX</span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link
                href="/search"
                className="text-emerald-100 hover:text-white transition-colors text-sm font-medium"
              >
                Search
              </Link>
              <Link
                href="/recommended"
                className="text-emerald-100 hover:text-white transition-colors text-sm font-medium"
              >
                Top Rated
              </Link>
              <Link
                href="/caution-list"
                className="text-emerald-100 hover:text-white transition-colors text-sm font-medium"
              >
                Caution
              </Link>
              <Link
                href="/resources"
                className="text-emerald-100 hover:text-white transition-colors text-sm font-medium"
              >
                Resources
              </Link>
              <Link
                href="/review"
                className="text-emerald-100 hover:text-white transition-colors text-sm font-medium"
              >
                Write a Review
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-emerald-950 text-emerald-300 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm">
                  RateMyLandlordPDX — Portland Metro Area
                </p>
                <p className="text-xs mt-1">
                  All reviews are anonymous. We do not collect personal information.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href="/search" className="hover:text-white transition-colors">
                  Search Landlords
                </Link>
                <Link href="/recommended" className="hover:text-white transition-colors">
                  Top Rated
                </Link>
                <Link href="/caution-list" className="hover:text-white transition-colors">
                  Caution List
                </Link>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Tenant Resources
                </Link>
                <Link href="/review" className="hover:text-white transition-colors">
                  Write a Review
                </Link>
                <Link href="/add-landlord" className="hover:text-white transition-colors">
                  Add a Landlord
                </Link>
              </div>
            </div>
            <div className="border-t border-emerald-800 mt-6 pt-4 text-center text-xs">
              <p>
                This site is for informational purposes. Reviews reflect individual
                tenant experiences and opinions.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
