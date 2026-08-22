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
      /* `[^.]+` instead of `:slug*` on purpose, and it must stay: redirects are
         matched BEFORE public/ files, and our own plush renders live in
         public/product/. A plain `/product/:slug*` 308s lumi-blue-2.png to the
         product page, which makes the image optimizer 400 and blanks the hero
         (caught locally 2026-07-28, before it reached a customer). Legacy Wix
         product slugs never contain a dot; asset filenames always do. */
      { source: "/product/:slug([^.]+)", destination: "/products/lumi", permanent: true },
      { source: "/shop", destination: "/products/lumi", permanent: true },
      /* Wix listing pages. `/category/all-products` was still taking real
         landings; the catch-all covers the sibling category slugs we cannot
         enumerate. Same `[^.]+` guard as `/product/` above — there is no
         public/category/ today, but a future asset folder must not be able to
         disappear behind this line (§8.21-b). */
      { source: "/category/all-products", destination: "/products/lumi", permanent: true },
      { source: "/category/:slug([^.]+)", destination: "/products/lumi", permanent: true },
      /* The Wix theme published an accessibility statement, and two weeks of
         Ahrefs data say people still land on it: 19 entrances, 10.8% of ALL
         site entries, second only to the home page, every one of them hitting a
         404. Founder's call on the destination (2026-08-12): the product page,
         so the traffic lands somewhere that converts. If a real statement is
         ever written, it replaces this line. */
      { source: "/accessibility-statement", destination: "/products/lumi", permanent: true },
      { source: "/blog", destination: "/stories", permanent: true },
      { source: "/blog/:slug*", destination: "/stories", permanent: true },
      { source: "/about", destination: "/team", permanent: true },
      { source: "/community", destination: "/stories", permanent: true },
      /* /refund and /shipping USED to 301 here, because pre-orders took no
         payment and there was nothing to refund or ship. Both are real pages
         since 2026-08-22 (§8.25-d) and the redirects were removed in the same
         commit. Do not restore them: a merchant that 301s its refund policy to
         its terms is the shape Razorpay's review rejects, and the legacy Wix
         inbound links now land on the real answer. */
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
