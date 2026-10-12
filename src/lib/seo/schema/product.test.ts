import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { placeholder as ph } from "@/lib/content/placeholder";
import { KHEELU_PRODUCT_ID } from "../urls";
import { productNode, type ProductFacts } from "./product";

/* The production placeholder scan (task 2.9) hunts the inline token across src/; built in pieces
   here so a test never reads as open content. */
const token = (body: string) => "{" + "ph:" + body + "}";

type SchemaOffer = Pick<Offer, "headlinePaise" | "availabilityStarts" | "prices">;
const prices = { token: "₹499", balance: "₹4,500", full: "₹7,999", mrp: "₹7,999" };
const tokenOffer: SchemaOffer = { headlinePaise: 499_900, availabilityStarts: "2026-11-15", prices: { ...prices, headline: "₹4,999" } };
const fullOffer: SchemaOffer = { headlinePaise: 799_900, availabilityStarts: "2026-11-15", prices: { ...prices, headline: "₹7,999" } };

/** Fixture facts in the shape the product page hands over from product.ts, policies.ts and the
 *  offer (tasks 2.1 and 5.2 own the real values). */
const kheelu: ProductFacts = {
  id: KHEELU_PRODUCT_ID,
  name: "Kheelu by Kheelona",
  alternateName: "Lumi",
  brand: "Kheelona",
  description: "A screen-free talking friend for children aged 3 to 7, with a parent app.",
  category: "Screen-free AI toy",
  path: "/products/kheelu",
  images: ["/media/kheelu-front.jpg"],
  countryOfOrigin: "IN",
  audience: { minAge: 3, maxAge: 7 },
  properties: [
    { name: "Languages", value: "English, Hindi and {mark:eight} more" },
    { name: "Size and weight", value: ph("F4", "size and weight") },
    { name: "Battery", value: `About ${token("F4 battery life")}` },
  ],
  offerDescription: "₹4,999 (incl. GST) for the first 500 units. Reserve with a refundable ₹499 today.",
  eligibleRegion: "IN",
  returnPolicy: { days: 7, country: "IN", freeReturn: true, fullRefund: true },
  shipping: { destination: "IN", free: true },
  warrantyMonths: 6,
};

describe("productNode", () => {
  it("builds Product + Offer with its return policy, shipping details and warranty", () => {
    expect(productNode(kheelu, tokenOffer)).toEqual({
      "@type": "Product",
      "@id": "https://kheelona.com/products/lumi#product",
      name: "Kheelu by Kheelona",
      alternateName: "Lumi",
      brand: { "@type": "Brand", name: "Kheelona" },
      manufacturer: { "@id": "https://kheelona.com/#organization" },
      description: "A screen-free talking friend for children aged 3 to 7, with a parent app.",
      category: "Screen-free AI toy",
      url: "https://kheelona.com/products/kheelu",
      image: ["https://kheelona.com/media/kheelu-front.jpg"],
      countryOfOrigin: { "@type": "Country", name: "India" },
      audience: { "@type": "PeopleAudience", suggestedMinAge: 3, suggestedMaxAge: 7 },
      additionalProperty: [{ "@type": "PropertyValue", name: "Languages", value: "English, Hindi and eight more" }],
      offers: {
        "@type": "Offer",
        url: "https://kheelona.com/products/kheelu",
        price: 4999,
        priceCurrency: "INR",
        availability: "https://schema.org/PreOrder",
        availabilityStarts: "2026-11-15",
        eligibleRegion: { "@type": "Country", name: "India" },
        description: "₹4,999 (incl. GST) for the first 500 units. Reserve with a refundable ₹499 today.",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "IN",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnFees: "https://schema.org/FreeReturn",
          refundType: "https://schema.org/FullRefund",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        },
        warranty: {
          "@type": "WarrantyPromise",
          durationOfWarranty: { "@type": "QuantitativeValue", value: 6, unitCode: "MON" },
        },
      },
    });
  });

  it("prices the offer at the offer's headline amount in each mode, in rupees", () => {
    expect(productNode(kheelu, tokenOffer).offers.price).toBe(4999);
    const full = productNode({ ...kheelu, offerDescription: "₹7,999 (incl. GST), paid in full when you order." }, fullOffer);
    expect(full.offers.price).toBe(7999);
    expect(full.offers.availabilityStarts).toBe("2026-11-15");
  });

  /* Architecture §9.2: additionalProperty from announced specs only. An unannounced spec is the
     absence of a fact, whether it arrives as a placeholder value or as a token inside the text. */
  it("drops every spec that is still a placeholder", () => {
    const names = productNode(kheelu, tokenOffer).additionalProperty?.map((p) => p.name);
    expect(names).toEqual(["Languages"]);
    expect(JSON.stringify(productNode(kheelu, tokenOffer))).not.toMatch(/PLACEHOLDER|F4|ph:/);
  });

  it("leaves additionalProperty out when no spec is announced", () => {
    const node = productNode({ ...kheelu, properties: [{ name: "Weight", value: ph("F4", "weight") }] }, tokenOffer);
    expect(node).not.toHaveProperty("additionalProperty");
  });

  /* D028: everything machines read leads with the total (₹4,999 incl. GST), never the ₹499 advance,
     which once made Bing say Kheelu costs ₹499. */
  it("refuses an offer description that leads with any amount but the headline", () => {
    expect(() => productNode({ ...kheelu, offerDescription: "Reserve for ₹499 today. Kheelu is ₹4,999 in total." }, tokenOffer)).toThrow(
      /lead with ₹4,999/,
    );
    expect(() => productNode({ ...kheelu, offerDescription: "₹4,999 (incl. GST), paid in full." }, fullOffer)).toThrow(/lead with ₹7,999/);
  });

  it("refuses a product description that leads with the advance", () => {
    expect(() => productNode({ ...kheelu, description: "From ₹499, a talking friend." }, tokenOffer)).toThrow(/lead with ₹4,999/);
  });

  it("accepts descriptions that name no amount at all", () => {
    expect(() => productNode({ ...kheelu, offerDescription: "Pre-order Kheelu." }, tokenOffer)).not.toThrow();
  });

  it("claims no free returns or full refund the policy does not state", () => {
    const node = productNode({ ...kheelu, returnPolicy: { days: 7, country: "IN", freeReturn: false, fullRefund: false } }, tokenOffer);
    expect(node.offers.hasMerchantReturnPolicy).toEqual({
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
    });
  });

  it("states a shipping rate only when delivery is free, and never a delivery time (D022)", () => {
    const paid = productNode({ ...kheelu, shipping: { destination: "IN", free: false } }, tokenOffer);
    expect(paid.offers.shippingDetails).toEqual({
      "@type": "OfferShippingDetails",
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
    });
  });

  it("refuses an @id that is not an absolute URL with a fragment", () => {
    expect(() => productNode({ ...kheelu, id: "/products/kheelu" }, tokenOffer)).toThrow(/@id/);
    expect(() => productNode({ ...kheelu, id: "https://kheelona.com/products/kheelu" }, tokenOffer)).toThrow(/@id/);
  });

  it("refuses an age band whose minimum is above its maximum", () => {
    expect(() => productNode({ ...kheelu, audience: { minAge: 7, maxAge: 3 } }, tokenOffer)).toThrow(/age/);
  });
});
