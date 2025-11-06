import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Green Rangers - Illinois Renewable Energy Jobs & Day Labor Services",
  description: "Find renewable energy jobs in Illinois and hire certified day labor crews at $120/day. NABCEP, NCCER, and OSHA certified professionals for solar installation, construction, and green energy projects.",
  keywords: ["renewable energy jobs", "Illinois solar jobs", "day labor Chicago", "solar installation", "green energy careers", "NABCEP certified", "construction crew"],
  authors: [{ name: "Green Rangers" }],
  openGraph: {
    title: "Green Rangers - Illinois Renewable Energy Jobs & Day Labor Services",
    description: "Find renewable energy jobs in Illinois and hire certified day labor crews at $120/day for solar installation and green energy projects.",
    url: "https://greenrangers.xyz",
    siteName: "Green Rangers",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Green Rangers - Illinois Renewable Energy Jobs & Day Labor Services",
    description: "Find renewable energy jobs in Illinois and hire certified day labor crews at $120/day.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
