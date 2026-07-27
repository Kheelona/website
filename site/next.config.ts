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
      /* Legacy Wix-site URLs (2026-07-28). This site replaces the old
         kheelona.com store, whose pages are still in Google's index — including
         product pages quoting the retired ₹2,999 price. 301s move the link
         equity here and stop the old prices competing with the real ones, which
         was the biggest active SEO liability on the list (V3-h). Every source
         below existed on the previous site. */
      { source: "/product-page/:slug*", destination: "/products/lumi", permanent: true },
      { source: "/product/:slug*", destination: "/products/lumi", permanent: true },
      { source: "/shop", destination: "/products/lumi", permanent: true },
      { source: "/blog", destination: "/stories", permanent: true },
      { source: "/blog/:slug*", destination: "/stories", permanent: true },
      { source: "/about", destination: "/team", permanent: true },
      { source: "/community", destination: "/stories", permanent: true },
      /* The old store had refund and shipping policies. There is nothing to
         refund or ship yet: pre-orders take no payment, so the reservation
         terms are the honest destination. */
      { source: "/refund", destination: "/terms", permanent: true },
      { source: "/shipping", destination: "/terms", permanent: true },
      /* Account routes from the Wix store have no equivalent here. */
      { source: "/login", destination: "/", permanent: true },
      { source: "/signup", destination: "/", permanent: true },
      { source: "/account/:path*", destination: "/", permanent: true },
      { source: "/cart", destination: "/products/lumi", permanent: true },
      { source: "/checkout/:path*", destination: "/products/lumi", permanent: true },
    ];
  },
};

export default nextConfig;
