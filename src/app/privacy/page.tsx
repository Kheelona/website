import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description:
    "Kheelona Privacy Policy - Learn how we collect, use, and protect your personal information and your child's data.",
  keywords: ["privacy policy", "data protection", "children's privacy", "COPPA"],
  path: "/privacy",
  ogType: "website",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="font-heading text-3xl md:text-4xl text-stroke-tangerine mb-8">
            PRIVACY POLICY
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Kheelona Robotics Private Limited (&quot;Kheelona,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy and your
                child&apos;s privacy. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you visit our website or use our products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Payment information (processed securely through payment partners)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Children&apos;s Information</h3>
              <p className="text-gray-700 mb-4">
                For children using Lumi, we may collect voice interactions to improve our AI
                responses. This data is processed locally when possible and anonymized when stored.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>To process and fulfill orders</li>
                <li>To improve our products and services</li>
                <li>To communicate with you about orders and updates</li>
                <li>To personalize your experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                We take children&apos;s privacy seriously. Parents have full control over their
                child&apos;s data and can request deletion at any time. We do not sell or share
                children&apos;s data with third parties for marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights,
                please contact us at:
              </p>
              <p className="text-gray-700">
                Email:{" "}
                <a href="mailto:privacy@kheelona.com" className="text-tangerine hover:underline">
                  privacy@kheelona.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-tangerine hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
