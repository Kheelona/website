import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  images: {
    // AVIF preferred, WebP fallback (AVIF is opt-in on this Next build).
    formats: ["image/avif", "image/webp"],
  },
  /* Nothing gains from telling the world which framework serves this (F-08). */
  poweredByHeader: false,
  async headers() {
    /* One policy for every HTML response on both hosts (F-03). The reasoning,
       including why script-src carries 'unsafe-inline' and what that does and
       does not cost, is in src/lib/security-headers.ts. The CSP ships
       Report-Only first and is flipped to enforcing in a separate deploy, once
       real traffic has said what it would have broken. */
    return [
      {
        /* Everything except Next's own build output, which is same-origin
           static files that no policy here protects. */
        source: "/((?!_next/static|_next/image).*)",
        headers: securityHeaders(process.env.NODE_ENV === "development"),
      },
    ];
  },
  async redirects() {
    return [
      {
        // intuitive short slug people will type/share (UX panel 2026-07-10)
        source: "/stories/why-three-to-six-matters-most",
        destination: "/stories/why-three-to-six-are-the-years-that-matter-most",
        permanent: true,
      },
      /* THE RENAME (2026-09-05). Lumi became Kheelu; the page moved once and
         the old address keeps working permanently.

         308, not 301, because that is what Next emits for `permanent: true`,
         and unlike 301 it guarantees the method and body survive. Query strings
         pass through untouched, so campaign parameters on any live ad, QR code
         or WhatsApp share still arrive attributed.

         Every legacy redirect below now points STRAIGHT at /products/kheelu
         rather than chaining through /products/lumi. A two-hop redirect costs a
         round trip, dilutes what it forwards, and is the standard way a rename
         quietly degrades the equity it was supposed to carry.

         This line is permanent. There is no date at which removing it is safe:
         printed QR codes, old WhatsApp forwards and two weeks of Ahrefs-recorded
         inbound links all point at the old path. */
      { source: "/products/lumi", destination: "/products/kheelu", permanent: true },

      /* Legacy Wix-site URLs (2026-07-28). This site replaces the old
         kheelona.com store, whose pages are still in Google's index — including
         product pages quoting the retired ₹2,999 price. 301s move the link
         equity here and stop the old prices competing with the real ones, which
         was the biggest active SEO liability on the list (V3-h). Every source
         below existed on the previous site. */
      { source: "/product-page/:slug*", destination: "/products/kheelu", permanent: true },
      /* `[^.]+` instead of `:slug*` on purpose, and it must stay: redirects are
         matched BEFORE public/ files, and our own plush renders live in
         public/product/. A plain `/product/:slug*` 308s lumi-blue-2.png to the
         product page, which makes the image optimizer 400 and blanks the hero
         (caught locally 2026-07-28, before it reached a customer). Legacy Wix
         product slugs never contain a dot; asset filenames always do. */
      { source: "/product/:slug([^.]+)", destination: "/products/kheelu", permanent: true },
      { source: "/shop", destination: "/products/kheelu", permanent: true },
      /* Wix listing pages. `/category/all-products` was still taking real
         landings; the catch-all covers the sibling category slugs we cannot
         enumerate. Same `[^.]+` guard as `/product/` above — there is no
         public/category/ today, but a future asset folder must not be able to
         disappear behind this line (§8.21-b). */
      { source: "/category/all-products", destination: "/products/kheelu", permanent: true },
      { source: "/category/:slug([^.]+)", destination: "/products/kheelu", permanent: true },
      /* The Wix theme published an accessibility statement, and two weeks of
         Ahrefs data say people still land on it: 19 entrances, 10.8% of ALL
         site entries, second only to the home page, every one of them hitting a
         404. Founder's call on the destination (2026-08-12): the product page,
         so the traffic lands somewhere that converts. If a real statement is
         ever written, it replaces this line. */
      { source: "/accessibility-statement", destination: "/products/kheelu", permanent: true },
      /* Three more Wix paths, from Search Console's "Not found (404)" report read on
         2026-09-05 (SEO round, A1): four `/post/<slug>` blog posts, `/terms-conditions`
         and `/for-the-parents`, all last crawled in March and still being re-fetched.
         Each 404 Google keeps re-crawling is crawl budget not spent on the ten pages
         it had never fetched at all. One hop each, to the closest live page. */
      { source: "/post/:slug*", destination: "/stories", permanent: true },
      { source: "/terms-conditions", destination: "/terms", permanent: true },
      { source: "/for-the-parents", destination: "/stories", permanent: true },
      /* Three URLs people actually typed, each 404ing, all three found in the
         Ahrefs Web Analytics export for the fortnight to 2026-09-05.
         `/lumi` is the product's name without its path — the single most
         guessable URL this site has, and it was the only one of the three with
         no handler at all. `/faq` is where a parent looks for the answers that
         live on the product page. `/sitemap` is what people type when they mean
         the .xml. None is a legacy Wix route; they are all just what humans
         guess, which is why they belong here rather than in the block above. */
      { source: "/lumi", destination: "/products/kheelu", permanent: true },
      { source: "/faq", destination: "/products/kheelu#faq", permanent: true },
      { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
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
      { source: "/cart", destination: "/products/kheelu", permanent: true },
      { source: "/checkout/:path*", destination: "/products/kheelu", permanent: true },
    ];
  },
};

export default nextConfig;
