import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateBreadcrumbs } from "@/lib/metadata";
import ContactUs from "@/components/sections/ContactUs";
import WhatsAppCommunity from "@/components/sections/WhatsAppCommunity";
import JoinUs from "@/components/sections/JoinUs";

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

      <div className="min-h-screen flex pt-40 flex-col">
        <Header />

        <ContactUs />
        <JoinUs />

        <Footer />
      </div>
    </>
  );
}
