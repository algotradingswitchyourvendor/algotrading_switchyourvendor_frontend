import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MarketPulse — Live Market Analytics",
    template: "%s | MarketPulse",
  },
  description:
    "Real-time Indian equity market analytics platform with live screening, dynamic columns, and institutional-grade data visualization.",
  keywords: ["stock market", "NSE", "BSE", "live data", "screener", "analytics", "MarketPulse"],
  openGraph: {
    type: "website",
    siteName: "MarketPulse",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
