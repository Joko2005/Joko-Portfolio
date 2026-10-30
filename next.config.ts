import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack's saved dev cache kept serving old CSS after globals.css changed, even across restarts.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    // Credly badge images, shown on Certificates.
    remotePatterns: [{ protocol: "https", hostname: "images.credly.com" }],
  },
};

export default nextConfig;
