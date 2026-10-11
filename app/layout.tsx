import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thehomefront.ai"),
  title: "HomeFront",
  description: "Streamlined access to your housing benefits",
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
    title: "HomeFront",
    description: "Streamlined access to your housing benefits.",
    url: "https://www.thehomefront.ai",
    siteName: "HomeFront",
    images: [
      {
        url: "/homefront-badge.png",
        width: 1200,
        height: 630,
        alt: "HomeFront - Streamlined access to your housing benefits",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeFront",
    description: "Streamlined access to your housing benefits.",
    images: ["/homefront-badge.png"],
  },
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
        <PWARegister />
        <Suspense fallback={<div className="min-h-[100dvh] bg-[#0b0f14]" />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
