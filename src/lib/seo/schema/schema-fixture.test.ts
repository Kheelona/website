import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { placeholder as ph } from "@/lib/content/placeholder";
import { jsonLd, pageGraph, siteGraph, type SchemaGraph } from "../jsonld";
import { KHEELU_PRODUCT_ID } from "../urls";
import { blogPostingNode } from "./blog-posting";
import { breadcrumbListNode } from "./breadcrumb-list";
import { faqPageNode } from "./faq-page";
import { howToNode } from "./how-to";
import { organizationNode } from "./organization";
import { productNode } from "./product";
import { aboutPageNode, contactPageNode } from "./web-page";
import { websiteNode } from "./website";

/*
 * The fixture every builder renders into, written to __fixtures__/schema-fixture.html: the file the
 * schema.org validator report of task 2.7 covers (lessons §6: content tests do not check validity).
 * A diff in that file means the schema changed, so check it again before merging: against the
 * schema.org vocabulary (types, properties, domains and ranges), and, with a browser, in
 * validator.schema.org (paste the file) and Google's Rich Results Test for Product, FAQPage,
 * BreadcrumbList and BlogPosting (the browser run is Phase 6 QA's, main session 2026-10-12).
 * Fixture facts only: the real ones are content's (tasks 2.1, 5.x).
 */

const offer: Pick<Offer, "headlinePaise" | "availabilityStarts" | "prices"> = {
  headlinePaise: 499_900,
  availabilityStarts: "2026-11-15",
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999" },
};

const site = siteGraph(
  organizationNode({
    name: "Kheelona",
    legalName: "Kheelona Robotics Private Limited",
    taxId: "29AAMCK1530E1ZN",
    description: "Kheelona makes Kheelu, a screen-free talking friend for children aged 3 to 7.",
    logo: "/brand/logo-mark.png",
    image: "/og.png",
    foundingDate: "2025",
    address: { street: "Line one, Line two", locality: "Bengaluru", region: "Karnataka", postalCode: "560001", country: "IN" },
    founders: [
      { name: "Apoorva Sahu", jobTitle: "Co-founder and CEO", sameAs: ["https://www.linkedin.com/in/sahu-apoorva/"] },
      { name: "Aman Soni", jobTitle: "Co-founder and CTO" },
    ],
    employees: [{ name: "Ria Mangala Rewari", jobTitle: "Head of Marketing" }],
    sameAs: ["https://www.linkedin.com/company/kheelona/", "https://www.instagram.com/kheelona/"],
    areaServed: "IN",
    contactPoint: {
      contactType: "customer support",
      email: "hello@kheelona.com",
      telephone: "+91 91875 46483",
      url: "https://wa.me/919187546483",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  }),
  websiteNode({ name: "Kheelona", inLanguage: "en-IN" }),
);

const productPage = pageGraph(
  productNode(
    {
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
        { name: "Modes", value: "Story mode and AI mode" },
        { name: "Size and weight", value: ph("F4", "size and weight") },
      ],
      offerDescription: "₹4,999 (incl. GST) for the first 500 units. Reserve with a refundable ₹499 today.",
      eligibleRegion: "IN",
      returnPolicy: { days: 7, country: "IN", freeReturn: true, fullRefund: true },
      shipping: { destination: "IN", free: true },
      warrantyMonths: 6,
    },
    offer,
  ),
  faqPageNode([
    { question: "How much is Kheelu?", answer: "Kheelu is ₹4,999 (incl. GST)." },
    { question: "Does Kheelu need Wi-Fi?", answer: "Story mode does not. AI mode uses your home Wi-Fi." },
  ]),
);

const articlePage = pageGraph(
  blogPostingNode({
    path: "/stories/learning-toys-for-a-three-year-old",
    headline: "Learning toys for a 3-year-old, skill by skill",
    description: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
    image: "/og/kheelu.jpg",
    published: "2026-07-28",
    updated: "2026-10-11",
    author: "Ria Mangala Rewari",
  }),
  breadcrumbListNode([
    { name: "Stories", path: "/stories" },
    { name: "Learning and play", path: "/stories#learning" },
  ]),
);

const setupPage = pageGraph(
  howToNode({
    name: "How to set up Kheelu",
    description: "Charge Kheelu, connect it to Wi-Fi with the parent app, and set your child's age.",
    path: "/setup",
    steps: [
      { name: "Charge Kheelu", text: "Plug Kheelu in until the light is steady." },
      { name: "Connect it to Wi-Fi", text: "Open the parent app and follow the steps." },
    ],
  }),
);

/* /team and /contact point at the Organization the shell declares (ruling 2026-10-12). */
const teamPage = pageGraph(
  aboutPageNode({
    name: "The people who build Kheelona",
    description:
      "Kheelona Robotics Private Limited, a small company in Bengaluru, makes Kheelu. Its three co-founders are Apoorva Sahu, Aman Soni and Kashyap C.R.",
    path: "/team",
  }),
);

const contactPage = pageGraph(contactPageNode({ name: "Contact Kheelona", path: "/contact" }));

const pages: readonly SchemaGraph[] = [site, productPage, articlePage, setupPage, teamPage, contactPage];

const html = [
  "<!doctype html>",
  '<html lang="en-IN"><head><title>JSON-LD fixture (task 2.7)</title>',
  ...pages.map((graph) => `<script type="application/ld+json">${jsonLd(graph)}</script>`),
  "</head><body></body></html>",
  "",
].join("\n");

/** Every node object anywhere in a value. */
function nodes(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (typeof value !== "object" || value === null) return [];
  return [value as Record<string, unknown>, ...Object.values(value).flatMap(nodes)];
}

describe("the schema fixture", () => {
  it("is the file the validator report covers", async () => {
    await expect(html).toMatchFileSnapshot("./__fixtures__/schema-fixture.html");
  });

  /* A byline's Person is self-sufficient (type, id, name) so an article validates on its own, and
     the Organization also lists that person: JSON-LD merges two declarations of one id, which is
     harmless only while they never disagree. */
  it("never declares one id with two different values", () => {
    const declarations = pages
      .flatMap((graph) => nodes(graph))
      .filter((n) => typeof n["@id"] === "string" && "@type" in n);
    const byId = Map.groupBy(declarations, (n) => n["@id"] as string);
    for (const [id, group] of byId) {
      for (const other of group.slice(1)) {
        for (const key of Object.keys(other).filter((k) => k in group[0])) {
          expect(other[key], `${id} ${key}`).toEqual(group[0][key]);
        }
      }
    }
    expect(byId.get("https://kheelona.com/team#ria-mangala-rewari")).toHaveLength(2);
  });

  it("declares the publisher and the product once, and every reference points at a declared node", () => {
    const all = pages.flatMap((graph) => nodes(graph));
    const declared = all.filter((n) => typeof n["@id"] === "string" && "@type" in n).map((n) => n["@id"] as string);
    for (const id of ["https://kheelona.com/#organization", "https://kheelona.com/#website", KHEELU_PRODUCT_ID]) {
      expect(declared.filter((d) => d === id), id).toHaveLength(1);
    }
    const references = all.filter((n) => Object.keys(n).length === 1 && typeof n["@id"] === "string").map((n) => n["@id"]);
    expect(references.length).toBeGreaterThan(0);
    for (const ref of references) expect(declared).toContain(ref);
  });

  it("reads back from the escaped text exactly as built", () => {
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    expect(scripts).toEqual(pages);
  });
});
