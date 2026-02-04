import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";

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

export default function AboutPage() {
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
          <section className="bg-gradient-to-b from-tangerine/10 to-white py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-5xl text-stroke-tangerine mb-6">
                OUR STORY
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                We believe every child deserves a friend who listens, learns, and grows with them.
                That&apos;s why we created{" "}
                <span className="text-tangerine font-semibold">Lumi</span>.
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 px-4" aria-labelledby="mission-heading">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2
                    id="mission-heading"
                    className="font-heading text-2xl md:text-4xl text-stroke-tangerine mb-6"
                  >
                    OUR MISSION
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    In a world where screens dominate children&apos;s attention, we saw an
                    opportunity to create something different. Something that engages, educates, and
                    nurtures young minds without a screen.
                  </p>
                  <p className="text-lg text-gray-700 mb-4">
                    Kheelona was born from a simple question:{" "}
                    <strong>What if a toy could truly understand and respond to a child?</strong>
                  </p>
                  <p className="text-lg text-gray-700">
                    Using the latest advances in AI and natural language processing, we created Lumi
                    — a talking companion that listens, responds, and adapts to each child&apos;s
                    unique personality and learning pace.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src="/images/lifestyle/all-colors-group-1.jpg"
                    alt="Lumi toys in all colors - Sky Blue, Mint Green, and Coral Pink"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="bg-sky-blue/10 py-16 px-4" aria-labelledby="values-heading">
            <div className="max-w-6xl mx-auto">
              <h2
                id="values-heading"
                className="font-heading text-2xl md:text-4xl text-stroke-tangerine text-center mb-12"
              >
                WHAT WE BELIEVE
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold text-lg mb-2">Screen-Free Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Children learn best through voice, touch, and imagination — not screens.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="font-bold text-lg mb-2">Multilingual from Day One</h3>
                  <p className="text-gray-600 text-sm">
                    Every child should learn in their mother tongue while exploring new languages.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="font-bold text-lg mb-2">Emotional Intelligence</h3>
                  <p className="text-gray-600 text-sm">
                    Understanding feelings is as important as learning ABCs and 123s.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-bold text-lg mb-2">Play-Based Learning</h3>
                  <p className="text-gray-600 text-sm">
                    The best education happens when children don&apos;t realize they&apos;re
                    learning.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="py-16 px-4" aria-labelledby="journey-heading">
            <div className="max-w-4xl mx-auto">
              <h2
                id="journey-heading"
                className="font-heading text-2xl md:text-4xl text-stroke-tangerine text-center mb-12"
              >
                OUR JOURNEY
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-tangerine/30" />

                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-6 mb-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-tangerine rounded-full -translate-x-1/2 mt-1" />

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <span className="text-tangerine font-bold text-lg">{milestone.year}</span>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recognition Section */}
          <section className="bg-muted-orange/10 py-16 px-4" aria-labelledby="recognition-heading">
            <div className="max-w-6xl mx-auto text-center">
              <h2
                id="recognition-heading"
                className="font-heading text-2xl md:text-4xl text-stroke-tangerine mb-8"
              >
                RECOGNIZED BY
              </h2>

              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                <Image
                  src="/images/logos/nasscomLogo.svg"
                  alt="NASSCOM"
                  width={120}
                  height={40}
                  className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/images/logos/elevateLogo.svg"
                  alt="Elevate"
                  width={120}
                  height={40}
                  className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-2xl md:text-3xl text-stroke-tangerine mb-4">
                JOIN OUR MISSION
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Help us bring screen-free learning to every child. Get Lumi for your little one
                today.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-tangerine hover:bg-tangerine/90 text-white px-8 py-4 rounded-xl font-heading text-xl transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
