import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata: Metadata = {
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
    icon: "/icons/homefront_icon-192.png",
    apple: "/icons/homefront_icon-180.png",
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
        <link rel="apple-touch-icon" href="/icons/homefront_icon-180.png" />
      </head>
      <body className="h-full">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
