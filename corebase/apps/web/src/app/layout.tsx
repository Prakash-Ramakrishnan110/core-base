import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "CoreBase | Open Source Backend as a Service",
  description: "The premium, self-hostable alternative to Firebase. specialized in dynamic schemas, auto-generated APIs, and enterprise-grade security.",
  keywords: ["BaaS", "Backend", "API", "PostgreSQL", "Database", "Open Source", "Self-hostable"],
  authors: [{ name: "CoreBase Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://corebase.dev",
    siteName: "CoreBase",
    title: "CoreBase - Build apps faster",
    description: "Instant backend for your next big idea.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CoreBase Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreBase - Backend as a Service",
    description: "Build scalable apps in minutes, not months.",
    creator: "@corebase_dev",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-slate-950 text-slate-50 selection:bg-blue-500/30`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
