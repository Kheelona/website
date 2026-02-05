import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Refund Policy",
  description:
    "Kheelona Refund Policy - Learn about our 30-day happiness guarantee, return process, and refund timelines.",
  keywords: ["refund policy", "returns", "money back guarantee", "happiness guarantee"],
  path: "/refund",
  ogType: "website",
});

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="font-heading text-3xl md:text-4xl text-stroke-tangerine mb-8">
            REFUND POLICY
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">30-Day Happiness Guarantee</h2>
              <p className="text-gray-700 mb-4">
                At Kheelona, we want you and your child to be completely happy with your purchase.
                If for any reason you&apos;re not satisfied, we offer a hassle-free 30-day return
                policy from the date of delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Eligibility for Returns</h2>
              <p className="text-gray-700 mb-4">To be eligible for a return:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>The request must be made within 30 days of delivery</li>
                <li>The product must be in its original condition and packaging</li>
                <li>The product must not show signs of damage or misuse</li>
                <li>All accessories and components must be included</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">How to Initiate a Return</h2>
              <ol className="list-decimal pl-6 mb-4 text-gray-700">
                <li className="mb-2">
                  Contact our support team at{" "}
                  <a href="mailto:support@kheelona.com" className="text-tangerine hover:underline">
                    support@kheelona.com
                  </a>{" "}
                  with your order number
                </li>
                <li className="mb-2">Our team will provide you with a return authorization</li>
                <li className="mb-2">Pack the product securely in its original packaging</li>
                <li className="mb-2">
                  Use the prepaid shipping label we provide (free return shipping)
                </li>
                <li className="mb-2">Drop off the package at the nearest courier location</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Refund Process</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  Once we receive your return, we will inspect the product within 2 business days
                </li>
                <li>Approved refunds are processed within 5-7 business days</li>
                <li>Refunds are credited to your original payment method</li>
                <li>You will receive an email confirmation once the refund is processed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Non-Refundable Items</h2>
              <p className="text-gray-700 mb-4">The following items are not eligible for refund:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Products damaged due to misuse or negligence</li>
                <li>Products with missing parts or accessories</li>
                <li>Products returned after 30 days of delivery</li>
                <li>Gift cards and promotional items</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Exchanges</h2>
              <p className="text-gray-700 mb-4">
                If you received a defective product or wish to exchange for a different variant, we
                will be happy to process an exchange at no additional cost. Contact our support team
                to initiate an exchange.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Warranty Claims</h2>
              <p className="text-gray-700 mb-4">
                For products with manufacturing defects discovered after 30 days but within the
                1-year warranty period, please refer to our warranty policy in the{" "}
                <Link href="/terms" className="text-tangerine hover:underline">
                  Terms & Conditions
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For any questions about returns or refunds, please contact us at:
              </p>
              <p className="text-gray-700">
                Email:{" "}
                <a href="mailto:support@kheelona.com" className="text-tangerine hover:underline">
                  support@kheelona.com
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
