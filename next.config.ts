import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output configuration for Vercel
  output: "standalone",

  // Image optimization
  images: {
    unoptimized: false,
    remotePatterns: [],
  },

  // Disable strict mode for production (optional)
  reactStrictMode: true,

  // PoweredByHeader
  poweredByHeader: false,
};

export default nextConfig;
