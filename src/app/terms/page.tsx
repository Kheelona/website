import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms & Conditions",
  description:
    "Kheelona Terms and Conditions - Read our terms of service, warranty information, and usage guidelines.",
  keywords: ["terms of service", "terms and conditions", "warranty", "user agreement"],
  path: "/terms",
  ogType: "website",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="font-heading text-3xl md:text-4xl text-stroke-tangerine mb-8">
            TERMS & CONDITIONS
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using Kheelona&apos;s website and products, you agree to be bound by
                these Terms and Conditions. If you disagree with any part of these terms, you may
                not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Products and Services</h2>
              <p className="text-gray-700 mb-4">
                Kheelona offers AI-powered educational toys designed for children. Product
                descriptions, features, and specifications are provided for informational purposes
                and may be updated without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Ordering and Payment</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                <li>Payment is required at the time of order</li>
                <li>We reserve the right to refuse or cancel orders</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Shipping and Delivery</h2>
              <p className="text-gray-700 mb-4">
                We offer free shipping across India. Delivery times are estimates and may vary based
                on location and availability.
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Metro cities: 3-5 business days</li>
                <li>Other locations: 5-7 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                We offer a 30-day happiness guarantee. If you&apos;re not satisfied with your
                purchase:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Contact us within 30 days of delivery</li>
                <li>Product must be in original condition</li>
                <li>Return shipping is free</li>
                <li>Refunds processed within 7 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Warranty</h2>
              <p className="text-gray-700 mb-4">
                All Lumi products come with a 1-year manufacturer warranty covering defects in
                materials and workmanship. The warranty does not cover:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Physical damage or misuse</li>
                <li>Water damage</li>
                <li>Unauthorized modifications</li>
                <li>Normal wear and tear</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on this website, including text, graphics, logos, and software, is the
                property of Kheelona Robotics and is protected by intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Kheelona shall not be liable for any indirect, incidental, special, or consequential
                damages arising from the use of our products or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India.
                Any disputes shall be subject to the exclusive jurisdiction of the courts in
                Bangalore, Karnataka.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700">
                Email:{" "}
                <a href="mailto:legal@kheelona.com" className="text-tangerine hover:underline">
                  legal@kheelona.com
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
