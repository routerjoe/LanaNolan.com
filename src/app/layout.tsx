import type { Metadata } from "next";
import { Inter, Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
  display: 'swap',
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: 'swap',
});

/**
 * SEO metadata (Next.js 15)
 * Using a static export to ensure metadata pipeline works with React 19.
 * Adjust NEXT_PUBLIC_SITE_URL in env for correct absolute URLs.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Player Profile | Class of 2027",
    template: "%s | Player Profile",
  },
  description:
    "Official recruiting website showcasing athletic achievements, academic stats, videos, schedule, and contact information.",
  openGraph: {
    title: "Player Profile | Class of 2027",
    description:
      "Official recruiting website showcasing athletic achievements, academic stats, videos, schedule, and contact information.",
    url: "/",
    siteName: "Player Profile",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Player Profile | Class of 2027",
    description:
      "Official recruiting website showcasing athletic achievements, academic stats, videos, schedule, and contact information.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${bebas.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
