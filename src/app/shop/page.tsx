import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopProductGrid } from "@/components/sections/ShopProductGrid";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";

// SEO Metadata for Shop page
export const metadata: Metadata = generatePageMetadata({
  title: "Shop Lumi - AI Educational Toys",
  description:
    "Shop Lumi AI-powered talking toys for children. Choose from Sky Blue, Mint Green, or Coral Pink. Screen-free educational entertainment. Free shipping across India. INR 2,999.",
  keywords: [
    "buy Lumi",
    "Lumi price",
    "AI toy India",
    "educational toy online",
    "talking toy for kids",
    "screen-free toy buy",
    "Kheelona shop",
    "children learning toy",
  ],
  path: "/shop",
  ogType: "website",
});

// Product data
const products = [
  {
    id: 1,
    name: "Sky Blue",
    slug: "lumi-sky-blue",
    price: 5999,
    discountedPrice: 2999,
    image: "/images/products/lumi-blue/front.png",
    description: "Lumi in calming Sky Blue - perfect for bedtime stories and learning adventures.",
    inStock: true,
  },
  {
    id: 2,
    name: "Mint Green",
    slug: "lumi-mint-green",
    price: 5999,
    discountedPrice: 2999,
    image: "/images/products/lumi-green/front.png",
    description: "Lumi in refreshing Mint Green - ideal for curious explorers and nature lovers.",
    inStock: true,
  },
  {
    id: 3,
    name: "Coral Pink",
    slug: "lumi-coral-pink",
    price: 5999,
    discountedPrice: 2999,
    image: "/images/products/lumi-pink-2.png",
    description:
      "Lumi in vibrant Coral Pink - great for creative play and imaginative storytelling.",
    inStock: true,
  },
];

// JSON-LD for Shop page
const shopJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    generateBreadcrumbs([
      { name: "Home", url: "/" },
      { name: "Shop", url: "/shop" },
    ]),
    {
      "@type": "CollectionPage",
      "@id": "https://kheelona.com/shop#webpage",
      url: "https://kheelona.com/shop",
      name: "Shop Lumi - AI Educational Toys",
      description: "Browse and purchase Lumi AI-powered educational toys for children.",
      isPartOf: { "@id": "https://kheelona.com/#website" },
      about: { "@id": "https://kheelona.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: `Lumi - ${product.name}`,
          description: product.description,
          image: `https://kheelona.com${product.image}`,
          url: `https://kheelona.com/shop/${product.slug}`,
          brand: {
            "@type": "Brand",
            name: "Kheelona",
          },
          offers: {
            "@type": "Offer",
            price: product.discountedPrice,
            priceCurrency: "INR",
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            priceValidUntil: "2025-12-31",
          },
        },
      })),
    },
  ],
};

export default function ShopPage() {
  return (
    <>
      <Script
        id="shop-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 pt-24 md:pt-28">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-sky-blue/10 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-5xl text-stroke-tangerine mb-4">
                SHOP LUMI
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Choose your child&apos;s new best friend. All Lumi toys come with free shipping
                across India and a 30-day happiness guarantee.
              </p>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-12 px-4" aria-labelledby="products-heading">
            <h2 id="products-heading" className="sr-only">
              Available Products
            </h2>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift transition-all"
                    itemScope
                    itemType="https://schema.org/Product"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 relative">
                      <Image
                        src={product.image}
                        alt={`Lumi ${product.name} - AI Educational Toy`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-4"
                        itemProp="image"
                      />
                      {product.inStock && (
                        <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-heading text-xl md:text-2xl mb-2" itemProp="name">
                        <span className="text-tangerine">LUMI</span> - {product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2" itemProp="description">
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div
                        className="flex items-center gap-3 mb-4"
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                      >
                        <span
                          className="text-2xl font-bold text-gray-900"
                          itemProp="price"
                          content={product.discountedPrice.toString()}
                        >
                          ₹{product.discountedPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="bg-tangerine/10 text-tangerine text-xs px-2 py-1 rounded">
                          50% OFF
                        </span>
                        <meta itemProp="priceCurrency" content="INR" />
                        <link itemProp="availability" href="https://schema.org/InStock" />
                      </div>

                      {/* CTA Button */}
                      <button
                        className="w-full bg-sky-blue hover:bg-sky-blue/90 text-white py-3 rounded-xl font-heading text-lg transition-colors"
                        aria-label={`Buy Lumi ${product.name} for ₹${product.discountedPrice}`}
                      >
                        BUY NOW
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Features Banner */}
          <section className="bg-muted-orange/10 py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🚚</span>
                  <span className="font-semibold">Free Shipping</span>
                  <span className="text-sm text-gray-600">Across India</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🔒</span>
                  <span className="font-semibold">Secure Payment</span>
                  <span className="text-sm text-gray-600">100% Protected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">😊</span>
                  <span className="font-semibold">30-Day Returns</span>
                  <span className="text-sm text-gray-600">Happiness Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🎁</span>
                  <span className="font-semibold">Gift Ready</span>
                  <span className="text-sm text-gray-600">Beautiful Packaging</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section for SEO */}
          <section className="py-12 px-4" aria-labelledby="faq-heading">
            <div className="max-w-3xl mx-auto">
              <h2
                id="faq-heading"
                className="font-heading text-2xl md:text-3xl text-stroke-tangerine text-center mb-8"
              >
                FREQUENTLY ASKED QUESTIONS
              </h2>

              <div className="space-y-4">
                <details className="bg-white rounded-xl border border-gray-200 p-4">
                  <summary className="font-semibold cursor-pointer">
                    What is included with Lumi?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Each Lumi comes with the toy, USB charging cable, quick start guide, and a
                    beautiful gift box. No batteries required - Lumi has a rechargeable battery that
                    lasts up to 8 hours of play.
                  </p>
                </details>

                <details className="bg-white rounded-xl border border-gray-200 p-4">
                  <summary className="font-semibold cursor-pointer">
                    How long does shipping take?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    We offer free shipping across India. Metro cities receive orders in 3-5 business
                    days, while other locations may take 5-7 business days.
                  </p>
                </details>

                <details className="bg-white rounded-xl border border-gray-200 p-4">
                  <summary className="font-semibold cursor-pointer">Is there a warranty?</summary>
                  <p className="mt-3 text-gray-600">
                    Yes! All Lumi toys come with a 1-year manufacturer warranty covering defects in
                    materials and workmanship. We also offer a 30-day happiness guarantee - if your
                    child doesn&apos;t love Lumi, we&apos;ll refund your purchase.
                  </p>
                </details>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
