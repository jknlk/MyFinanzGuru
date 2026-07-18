import type { Metadata } from "next";
import { Caveat, Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/animation/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/CookieConsent";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const SITE_URL = "https://myfinanzguru.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MyFinanzGuru — Independent Financial Guidance in Germany",
    template: "%s — MyFinanzGuru",
  },
  description:
    "Free, independent financial guidance for people living in Germany. Understand your money, keep more of it, and grow it with a personal advisor — no sales pressure.",
  openGraph: {
    type: "website",
    locale: "en_DE",
    siteName: "MyFinanzGuru",
    url: SITE_URL,
    title: "MyFinanzGuru — Independent Financial Guidance in Germany",
    description:
      "Free, independent financial guidance for people living in Germany. Understand your money, keep more of it, and grow it.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyFinanzGuru — Independent Financial Guidance in Germany",
    description:
      "Free, independent financial guidance for people living in Germany.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              name: "MyFinanzGuru",
              url: SITE_URL,
              description:
                "Independent financial guidance for people living in Germany covering savings, insurance, tax, retirement and real estate.",
              areaServed: "DE",
              priceRange: "Free initial consultation",
            }),
          }}
        />
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
