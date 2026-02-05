import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Shipping Policy",
  description:
    "Kheelona Shipping Policy - Free shipping across India, delivery timelines, and order tracking information.",
  keywords: ["shipping policy", "free shipping", "delivery", "order tracking", "India shipping"],
  path: "/shipping",
  ogType: "website",
});

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="font-heading text-3xl md:text-4xl text-stroke-tangerine mb-8">
            SHIPPING POLICY
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> December 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Free Shipping Across India</h2>
              <p className="text-gray-700 mb-4">
                We offer FREE shipping on all orders across India. No minimum order value required!
                Every Lumi product is shipped with care to ensure it reaches you in perfect
                condition.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Delivery Timelines</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <table className="w-full text-gray-700">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Location</th>
                      <th className="text-left py-2 font-semibold">Estimated Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Metro Cities (Delhi, Mumbai, Bangalore, etc.)</td>
                      <td className="py-3">3-5 business days</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Tier 2 Cities</td>
                      <td className="py-3">5-7 business days</td>
                    </tr>
                    <tr>
                      <td className="py-3">Other Locations</td>
                      <td className="py-3">7-10 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 text-sm">
                *Delivery times are estimates and may vary due to holidays, weather conditions, or
                unforeseen circumstances.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Order Processing</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Orders are processed within 1-2 business days</li>
                <li>Orders placed after 2 PM IST may be processed the next business day</li>
                <li>
                  Orders placed on weekends or holidays will be processed the next business day
                </li>
                <li>You will receive an email confirmation once your order is shipped</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Order Tracking</h2>
              <p className="text-gray-700 mb-4">
                All shipments are fully tracked. Once your order is shipped, you will receive:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>An email with your tracking number</li>
                <li>A link to track your shipment in real-time</li>
                <li>SMS updates on delivery status (if phone number provided)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Shipping Partners</h2>
              <p className="text-gray-700 mb-4">
                We partner with trusted logistics providers to ensure safe and timely delivery of
                your orders. Our shipping partners include leading courier services with extensive
                coverage across India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Delivery Attempts</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Our courier partners will make up to 3 delivery attempts</li>
                <li>
                  If you&apos;re not available, the courier will leave a delivery attempt notice
                </li>
                <li>You can reschedule delivery by contacting the courier directly</li>
                <li>Unclaimed packages will be returned after the third attempt</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Damaged or Lost Packages</h2>
              <p className="text-gray-700 mb-4">
                In the rare event that your package arrives damaged or is lost in transit:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Contact us within 48 hours of delivery for damaged packages</li>
                <li>Take photos of the damaged packaging and product</li>
                <li>We will arrange for a replacement or refund at no additional cost</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">International Shipping</h2>
              <p className="text-gray-700 mb-4">
                Currently, we only ship within India. We are working on expanding our shipping to
                international destinations. Please check back for updates or contact us for special
                requests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For any shipping-related queries, please contact us at:
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
