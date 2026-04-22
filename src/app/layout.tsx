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
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {/* Navigation */}
        <header className="bg-emerald-700 text-white shadow-md">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                RateMyLandlord<span className="text-emerald-200">PDX</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
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
                className="bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors"
              >
                Write a Review
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
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
            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs">
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
