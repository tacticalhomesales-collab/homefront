import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thehomefront.ai"),
  title: "HomeFront | Veteran-Led Real Estate in North County San Diego",
  description: "Veteran-led HomeFront real estate team serving Fallbrook, Oceanside, Bonsall, Vista and North County San Diego. VA homebuying guidance, local buyer representation and home-selling strategy.",
  applicationName: "HomeFront",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "HomeFront",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icons/homefront_icon-red-192.png",
    apple: "/icons/homefront_homefront_logo_transparent.png",
  },
  openGraph: {
    title: "HomeFront | North County San Diego Real Estate",
    description: "Veteran-led real estate team in Fallbrook, Oceanside and North County. Buying, selling and VA homebuying guidance.",
    url: "https://www.thehomefront.ai",
    siteName: "HomeFront",
    images: [
      {
        url: "/homefront-badge.png",
        width: 1200,
        height: 630,
        alt: "HomeFront veteran-led North County San Diego real estate team",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeFront | Veteran-Led North County Real Estate",
    description: "Buy or sell in Fallbrook, Oceanside and North County San Diego with HomeFront. VA homebuying guidance and local expertise.",
    images: ["/homefront-badge.png"],
  },
};

const homeFrontOrganization = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "HomeFront Realty Group",
  url: "https://www.thehomefront.ai",
  description: "Veteran-led real estate team assisting buyers and sellers throughout North County San Diego, including buyers exploring VA financing.",
  areaServed: [
    "Fallbrook, California",
    "Oceanside, California",
    "Bonsall, California",
    "Vista, California",
    "San Marcos, California",
    "Valley Center, California"
  ]
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-14883340182"
          strategy="afterInteractive"
        />
        <Script id="google-ads-base-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-14883340182');`}
        </Script>
        <link
          rel="apple-touch-icon"
          href="/icons/homefront_homefront_logo_transparent.png"
        />
      </head>
      <body className="h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFrontOrganization) }}
        />
        <PWARegister />
        <Suspense fallback={<div className="min-h-[100dvh] bg-[#0b0f14]" />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
