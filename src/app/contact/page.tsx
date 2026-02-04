import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";

// SEO Metadata for Contact page
export const metadata: Metadata = generatePageMetadata({
  title: "Contact Us - Get in Touch",
  description:
    "Have questions about Lumi or Kheelona? Contact our friendly support team. We're here to help with orders, product questions, and partnership inquiries.",
  keywords: [
    "contact Kheelona",
    "Kheelona support",
    "Lumi help",
    "customer service",
    "order inquiry",
    "Kheelona phone number",
    "Kheelona email",
  ],
  path: "/contact",
  ogType: "website",
});

// Contact information
const contactInfo = {
  email: "hello@kheelona.com",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  address: "Bangalore, Karnataka, India",
  hours: "Monday - Saturday, 9:00 AM - 6:00 PM IST",
};

// FAQ data for contact page
const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive an email with tracking information. You can also reach out to us with your order number for updates.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day happiness guarantee. If your child doesn't love Lumi, contact us for a full refund. The product must be in original condition.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship across India. International shipping is coming soon! Sign up for our newsletter to be notified.",
  },
  {
    question: "How do I become a reseller or partner?",
    answer:
      "We love partnering with like-minded businesses! Please email us at partnerships@kheelona.com with details about your organization.",
  },
];

// JSON-LD for Contact page
const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    generateBreadcrumbs([
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" },
    ]),
    {
      "@type": "ContactPage",
      "@id": "https://kheelona.com/contact#webpage",
      url: "https://kheelona.com/contact",
      name: "Contact Kheelona",
      description: "Get in touch with the Kheelona team for support, questions, or partnerships.",
      isPartOf: { "@id": "https://kheelona.com/#website" },
      about: { "@id": "https://kheelona.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://kheelona.com/#organization-contact",
      name: "Kheelona Robotics",
      url: "https://kheelona.com",
      email: contactInfo.email,
      telephone: contactInfo.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: contactInfo.phone,
          contactType: "customer service",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "18:00",
          },
        },
        {
          "@type": "ContactPoint",
          email: "partnerships@kheelona.com",
          contactType: "sales",
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main id="main-content" className="flex-1 pt-24 md:pt-28">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-sky-blue/10 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-3xl md:text-5xl text-stroke-tangerine mb-4">
                GET IN TOUCH
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Have questions? We&apos;re here to help! Reach out and our friendly team will get
                back to you within 24 hours.
              </p>
            </div>
          </section>

          {/* Contact Grid */}
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                  <h2 className="font-heading text-xl md:text-2xl mb-6">SEND US A MESSAGE</h2>

                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          aria-required="true"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                      >
                        <option value="">Select a topic</option>
                        <option value="order">Order Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        aria-required="true"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-tangerine hover:bg-tangerine/90 text-white py-4 rounded-xl font-heading text-lg transition-colors"
                    >
                      SEND MESSAGE
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  {/* Direct Contact */}
                  <div className="bg-muted-orange/10 rounded-2xl p-6 md:p-8">
                    <h2 className="font-heading text-xl md:text-2xl mb-6">CONTACT INFORMATION</h2>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">📧</span>
                        <div>
                          <h3 className="font-semibold">Email</h3>
                          <a
                            href={`mailto:${contactInfo.email}`}
                            className="text-tangerine hover:underline"
                          >
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <span className="text-2xl">📱</span>
                        <div>
                          <h3 className="font-semibold">WhatsApp</h3>
                          <a
                            href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, "")}`}
                            className="text-tangerine hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {contactInfo.whatsapp}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <span className="text-2xl">📍</span>
                        <div>
                          <h3 className="font-semibold">Location</h3>
                          <p className="text-gray-600">{contactInfo.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <span className="text-2xl">🕐</span>
                        <div>
                          <h3 className="font-semibold">Business Hours</h3>
                          <p className="text-gray-600">{contactInfo.hours}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-sky-blue/10 rounded-2xl p-6 md:p-8">
                    <h2 className="font-heading text-xl md:text-2xl mb-4">FOLLOW US</h2>
                    <p className="text-gray-600 mb-4">
                      Join our community for parenting tips, updates, and exclusive offers.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://www.instagram.com/kheelona_robotics/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-3 rounded-xl hover:shadow-md transition-shadow"
                        aria-label="Follow us on Instagram"
                      >
                        <span className="text-2xl">📸</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/company/kheelona/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-3 rounded-xl hover:shadow-md transition-shadow"
                        aria-label="Follow us on LinkedIn"
                      >
                        <span className="text-2xl">💼</span>
                      </a>
                      <a
                        href="https://www.facebook.com/kheelona/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white p-3 rounded-xl hover:shadow-md transition-shadow"
                        aria-label="Follow us on Facebook"
                      >
                        <span className="text-2xl">👍</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-gray-50 py-12 px-4" aria-labelledby="faq-heading">
            <div className="max-w-3xl mx-auto">
              <h2
                id="faq-heading"
                className="font-heading text-2xl md:text-3xl text-stroke-tangerine text-center mb-8"
              >
                COMMON QUESTIONS
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-4 group"
                  >
                    <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                      {faq.question}
                      <span className="text-tangerine group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>

              <p className="text-center mt-8 text-gray-600">
                Can&apos;t find what you&apos;re looking for?{" "}
                <Link href="/blog" className="text-tangerine hover:underline">
                  Check our blog
                </Link>{" "}
                or send us a message above.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
