import type { Offer, OrPlaceholder, RichTextString, SitePath } from "@/content/types";
import { isPlaceholder } from "@/lib/content/placeholder";
import { nodesToPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { leadWithHeadline } from "../price-lead";
import { absoluteUrl, ORGANIZATION_ID } from "../urls";
import { countryNode, definedOnly, requireText, type CountryCode } from "./shared";

/**
 * The Product node with its Offer, return policy, shipping details and warranty (architecture
 * §9.2, ADR-012). The product page emits it; Home does not.
 *
 * Text arrives as plain text (serialise content with `toPlainText(value, offer)` first), except the
 * spec values, which arrive as content so the builder can drop the unannounced ones. Amounts and
 * the availability date come from the offer view model only, so the schema price is always the
 * price the page and the checkout show (4999 in token mode, 7999 in full mode). Refused (task 2.13):
 * no image (an empty `image` list fails the rich-result validators) and a price that is not a
 * positive whole number of rupees, not the visible headline, or above the MRP. Never emitted:
 * `priceValidUntil` (the offer is bounded by units, not a date), a delivery time (D022), ratings or
 * reviews (none exist).
 */

/** The parts of the offer view model the schema reads. */
export type SchemaOffer = Pick<Offer, "headlinePaise" | "availabilityStarts" | "prices">;

export interface ProductFacts {
  /** An absolute URL with a fragment; Kheelu's is `KHEELU_PRODUCT_ID` and never changes. */
  readonly id: string;
  readonly name: string;
  /** The former name, so one product never reads as two (Kheelu's: "Lumi"). */
  readonly alternateName?: string;
  readonly brand: string;
  readonly description: string;
  readonly category?: string;
  /** The product page: the Offer's `url`. */
  readonly path: SitePath;
  /** Stable `/media/` URLs (ADR-010). */
  readonly images: readonly SitePath[];
  readonly countryOfOrigin: CountryCode;
  readonly audience: { readonly minAge: number; readonly maxAge: number };
  /** Spec rows as content: a value that is a placeholder, or holds one, is left out. */
  readonly properties?: readonly { readonly name: string; readonly value: OrPlaceholder<RichTextString> }[];
  readonly offerDescription: string;
  readonly eligibleRegion: CountryCode;
  readonly returnPolicy: {
    /** Days from delivery (D021). */
    readonly days: number;
    readonly country: CountryCode;
    /** True only while the return pickup is free (D033). */
    readonly freeReturn: boolean;
    readonly fullRefund: boolean;
  };
  readonly shipping: { readonly destination: CountryCode; readonly free: boolean };
  readonly warrantyMonths: number;
}

const ABSOLUTE_ID = /^https:\/\/[^\s#]+#[^\s#]+$/;

function holdsPlaceholder(nodes: readonly RichNode[]): boolean {
  return nodes.some((node) => isPlaceholder(node) || ("children" in node && holdsPlaceholder(node.children)));
}

/** The announced specs as PropertyValue nodes; undefined when none is announced. */
function announcedProperties(properties: ProductFacts["properties"]) {
  const announced = (properties ?? []).flatMap(({ name, value }) => {
    if (isPlaceholder(value)) return [];
    const nodes = parseRichText(value);
    if (holdsPlaceholder(nodes)) return [];
    return [{ "@type": "PropertyValue" as const, name: requireText(name, "A spec name"), value: nodesToPlainText(nodes) }];
  });
  return announced.length > 0 ? announced : undefined;
}

/**
 * The Offer's price in rupees: the offer's headline amount, a positive whole number of rupees that
 * is the amount the page shows (`prices.headline` is formatted from the same paise, rounded to the
 * rupee) and no more than the MRP (`prices.mrp`, D034: selling above it is unlawful). Anything else
 * throws, so the build stops before a broken or wrong price is published.
 */
function schemaPrice(offer: SchemaOffer): number {
  const paise = offer.headlinePaise;
  if (!Number.isSafeInteger(paise) || paise <= 0 || paise % 100 !== 0) {
    throw new Error(`Product price: headlinePaise ${paise} is not a positive whole number of rupees`);
  }
  const rupees = paise / 100;
  const shown = Number(offer.prices.headline.replace(/[^\d]/g, ""));
  if (shown !== rupees) {
    throw new Error(`Product price: ${rupees} is not the headline ${offer.prices.headline} the page shows`);
  }
  const digits = offer.prices.mrp.replace(/[^\d]/g, "");
  const mrp = Number(digits);
  if (digits === "" || !Number.isSafeInteger(mrp) || mrp <= 0) {
    throw new Error(`Product price: the MRP "${offer.prices.mrp}" is not a positive amount in rupees`);
  }
  if (rupees > mrp) {
    throw new Error(`Product price: ${rupees} is above the MRP ${offer.prices.mrp}`);
  }
  return rupees;
}

export function productNode(facts: ProductFacts, offer: SchemaOffer) {
  if (!ABSOLUTE_ID.test(facts.id)) {
    throw new Error(`Product @id "${facts.id}" must be an absolute https URL with a fragment`);
  }
  const { minAge, maxAge } = facts.audience;
  if (minAge > maxAge) throw new Error(`Product age band ${minAge} to ${maxAge}: the minimum is above the maximum`);
  if (facts.images.length === 0) throw new Error(`Product "${facts.name}" needs at least one image`);
  const price = schemaPrice(offer);
  const headline = offer.prices.headline;
  const url = absoluteUrl(facts.path);
  const { returnPolicy, shipping } = facts;

  return definedOnly({
    "@type": "Product" as const,
    "@id": facts.id,
    name: requireText(facts.name, "Product name"),
    alternateName: facts.alternateName,
    brand: { "@type": "Brand", name: facts.brand },
    manufacturer: { "@id": ORGANIZATION_ID },
    description: leadWithHeadline(facts.description, headline, "Product description"),
    category: facts.category,
    url,
    image: facts.images.map(absoluteUrl),
    countryOfOrigin: countryNode(facts.countryOfOrigin),
    audience: { "@type": "PeopleAudience", suggestedMinAge: minAge, suggestedMaxAge: maxAge },
    additionalProperty: announcedProperties(facts.properties),
    offers: {
      "@type": "Offer" as const,
      url,
      price,
      priceCurrency: "INR",
      availability: "https://schema.org/PreOrder",
      availabilityStarts: offer.availabilityStarts,
      eligibleRegion: countryNode(facts.eligibleRegion),
      description: leadWithHeadline(facts.offerDescription, headline, "Offer description"),
      hasMerchantReturnPolicy: definedOnly({
        "@type": "MerchantReturnPolicy",
        applicableCountry: returnPolicy.country,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: returnPolicy.days,
        returnFees: returnPolicy.freeReturn ? "https://schema.org/FreeReturn" : undefined,
        refundType: returnPolicy.fullRefund ? "https://schema.org/FullRefund" : undefined,
      }),
      shippingDetails: definedOnly({
        "@type": "OfferShippingDetails",
        shippingRate: shipping.free ? { "@type": "MonetaryAmount", value: 0, currency: "INR" } : undefined,
        shippingDestination: { "@type": "DefinedRegion", addressCountry: shipping.destination },
      }),
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: { "@type": "QuantitativeValue", value: facts.warrantyMonths, unitCode: "MON" },
      },
    },
  });
}

export type ProductNode = ReturnType<typeof productNode>;
