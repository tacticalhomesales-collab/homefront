import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata: Metadata = {
  title: "HomeFront",
  description: "HomeFront Ambassador — your personal referral QR.",
  applicationName: "Ambassador",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Ambassador",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
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
      <body className="h-full">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
