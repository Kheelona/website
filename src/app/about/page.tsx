import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";
import AboutHeroSection from "@/components/sections/AboutHeroSection";
import TrustBadges from "@/components/sections/TrustBadges";
import Team from "@/components/sections/Team";
import OurMission from "@/components/sections/OurMission";
import { getProducts } from "@/lib/wix/services/products";
import ProductCards from "@/components/sections/ProductCards2";
import Testimonials from "@/components/sections/Testimonials2";
import WhatsAppCommunity from "@/components/sections/WhatsAppCommunity2";

// SEO Metadata for About page
export const metadata: Metadata = generatePageMetadata({
  title: "About Kheelona - Our Mission & Story",
  description:
    "Kheelona Robotics creates AI-powered educational toys that help children learn through play. Learn about our mission to reduce screen time and nurture curious minds.",
  keywords: [
    "Kheelona company",
    "about Kheelona",
    "Kheelona Robotics",
    "AI toy company India",
    "educational toy startup",
    "Lumi creators",
    "EdTech India",
    "children education startup",
  ],
  path: "/about",
  ogType: "website",
});

// Company milestones
const milestones = [
  { year: "2023", event: "Kheelona founded with a mission to reduce children's screen time" },
  { year: "2023", event: "First prototype of Lumi developed" },
  { year: "2024", event: "Lumi launched with 10+ language support" },
  { year: "2024", event: "10,000+ happy families across India" },
  { year: "2025", event: "Expanding to international markets" },
];

// JSON-LD for About page
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    generateBreadcrumbs([
      { name: "Home", url: "/" },
      { name: "About", url: "/about" },
    ]),
    {
      "@type": "AboutPage",
      "@id": "https://kheelona.com/about#webpage",
      url: "https://kheelona.com/about",
      name: "About Kheelona - Our Mission & Story",
      description:
        "Learn about Kheelona Robotics and our mission to create AI-powered educational toys.",
      isPartOf: { "@id": "https://kheelona.com/#website" },
      about: { "@id": "https://kheelona.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://kheelona.com/#organization-detail",
      name: "Kheelona Robotics",
      alternateName: "Kheelona",
      url: "https://kheelona.com",
      logo: "https://kheelona.com/images/logo.png",
      description:
        "Kheelona Robotics is an Indian EdTech company creating AI-powered educational toys that help children learn through play while reducing screen time.",
      foundingDate: "2023",
      founders: [
        {
          "@type": "Person",
          name: "Kheelona Team",
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressLocality: "India",
      },
      sameAs: [
        "https://www.instagram.com/kheelona_robotics/",
        "https://www.linkedin.com/company/kheelona/",
        "https://www.facebook.com/kheelona/",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Educational Toys",
        "Child Development",
        "Screen-Free Learning",
        "Multilingual Education",
      ],
      slogan: "Smartest Playmates for Brightest Minds",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 10,
        maxValue: 50,
      },
    },
  ],
};

export default async function AboutPage() {
  const products = await getProducts();
  return (
    <>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 pt-24 md:pt-28">
          {/* Hero Section */}
          <AboutHeroSection />
          <TrustBadges bg="bg-tangerine" />
          <Team />
          <OurMission />
          <ProductCards wixProducts={products} />
          <Testimonials />
          <WhatsAppCommunity />
        </main>

        <Footer />
      </div>
    </>
  );
}
