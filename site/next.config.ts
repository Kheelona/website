import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF preferred, WebP fallback (AVIF is opt-in on this Next build).
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        // intuitive short slug people will type/share (UX panel 2026-07-10)
        source: "/stories/why-three-to-six-matters-most",
        destination: "/stories/why-three-to-six-are-the-years-that-matter-most",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
