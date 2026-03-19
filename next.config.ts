import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Removed invalid keys: swcMinify and experimental.turbopack
};

export default nextConfig;
