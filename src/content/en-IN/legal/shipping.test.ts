import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL, GSTIN, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_HREF } from "@/config/site";
import type { LegalPart } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { isPlaceholder } from "@/lib/content/placeholder";
import { buildOffer } from "@/lib/offer/offer";
import { TYPED_AMOUNT } from "@/lib/seo/price-lead";
import { CTAS, CTA_IDS } from "@/lib/tracking/cta";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { shippingFixture } from "../../../../test/fixtures/legal/shipping";
import { parseMockup } from "../../../../test/support/mockup-compare";
import { DELIVERY_TEXT } from "../delivery";
import { DEFAULT_OG } from "../organization";
import { FAULTY_REPORT_DAYS, PAYMENT_METHODS, RETURN_DAYS } from "../policies";
import { routeFor } from "../routes";
import { seller } from "../seller";
import { shippingPage } from "./shipping";

/* The /shipping module (task 5.14; structure §5 row shipping.html; wiki/site/pages/shipping.md, the approved mockup
 * mockup/pages/shipping.html, D046). Its words against the approved page are the route's test (every word of <main>, with
 * the markup); this file holds the rules the plan and the copy page set for this page: a draft until the founder approves
 * it (D029); the delivery line from the one delivery value, never typed, in the page and in the meta description alike
 * (D023; shipping.md "Notes for the build"); amounts only as price tokens (D028); the seller, grievance and contact facts
 * and the policy numbers read from their modules, never retyped (D032, D021, D022, D024; 4.4's guard: no GSTIN); the
 * no placeholder left, each filled or ruled off by the founder (task 6.7; D055 items 7-9); the `shipping-learn` close
 * (architecture §8.3). */

const SOURCE = readRepoFile("src/content/en-IN/legal/shipping.ts");
/** The module without its comments, for the "never typed" rules (a comment may name what a value says). */
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const token = buildOffer("token");
const full = buildOffer("full");

/** Every string anywhere in the module (deep), for the page-wide word rules. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object" && !isPlaceholder(value)) for (const v of Object.values(value)) strings(v, out);
  return out;
}

/** The parts as the content shape types them. */
const PARTS: readonly LegalPart[] = shippingPage.parts;
const part = (id: string): LegalPart => {
  const found = PARTS.find((p) => p.id === id);
  if (!found) throw new Error(`the shipping page has no part #${id}`);
  return found;
};
/** A part's visible words in token mode, its blocks joined. */
const partText = (id: string) =>
  part(id)
    .blocks.flatMap((b) => strings(b))
    .map((s) => toPlainText(s, token))
    .join("\n");

describe("the shipping page: the route and its head", () => {
  it("is the module the URL plan names for /shipping (routes.ts: legal/shipping)", () => {
    expect(routeFor("/shipping")).toMatchObject({ kind: "legal", module: "legal/shipping" });
    expect(shippingPage.slug).toBe("shipping");
  });

  it("carries the copy page's meta title and description, within 60 and 155 characters, and the default share card", () => {
    const title = toPlainText(shippingPage.meta.title);
    const description = toPlainText(shippingPage.meta.description);
    expect(title).toBe("Kheelu shipping and delivery in India · Kheelona");
    expect(description).toBe(
      "Kheelu delivery and shipping in India: deliveries start mid-November, delivery is included anywhere in India, and you get tracking at dispatch.",
    );
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(shippingPage.meta.og).toBe(DEFAULT_OG);
  });

  it("renders the meta description's delivery words from the one delivery value, never typed (D023; shipping.md build notes)", () => {
    const words = `${DELIVERY_TEXT.charAt(0).toLowerCase()}${DELIVERY_TEXT.slice(1)}`;
    expect(toPlainText(shippingPage.meta.description)).toContain(`India: ${words},`);
    expect(CODE).toMatch(/\bDELIVERY_TEXT\b/);
    expect(CODE).not.toMatch(/mid-November/i);
  });

  it("opens with the recommended H1, its Hand accent on “plain words.”, and the approved lead (shipping.md fold 1)", () => {
    expect(shippingPage.hero.title).toBe("Shipping and delivery, in {hand:plain words.}");
    expect(shippingPage.hero.lead).toBe(
      "How Kheelu delivery and shipping work: when it leaves, where it goes, and what it costs to get to you. Which is nothing extra.",
    );
    expect("eyebrow" in shippingPage.hero).toBe(false);
  });

  it("puts Kheelu's note on a blue board: the founder-approved line on a Sunshine hand sticker, every image decorative", () => {
    const art = shippingPage.hero.art!;
    expect(art.tone).toBe("blue");
    expect(art.sticker).toEqual({ tone: "sun", tilt: 4, variant: "hand", lines: ["I’ll help pack.", "Mostly by sitting", "in the box."] });
    const images = art.layers.flatMap((layer) => ("image" in layer && layer.image ? [layer.image] : []));
    expect(images).toHaveLength(2);
    for (const image of images) expect(image.alt).toBe("");
    expect(art.layers.flatMap((layer) => ("doodle" in layer && layer.doodle ? [layer.doodle.name] : []))).toEqual(["chalk-spark-lines"]);
  });
});

describe("the shipping page: approved as final by the founder (D067, after D029)", () => {
  it("is approved, so no draft note shows and the production build accepts it (ADR-004)", () => {
    expect(shippingPage.status).toBe("approved");
  });

  it("is last updated on the founder's date, 14 October 2026 (D055 item 8; shipping.md fold 1)", () => {
    expect(shippingPage.approvedOn).toBe("2026-10-14");
  });
});

describe("the shipping page: the short version (shipping.md fold 2)", () => {
  it("is a trust list of five, in the copy page's order and words, the delivery line from the offer", () => {
    expect(shippingPage.summary.title).toBe("The {hand:short version.}");
    expect(shippingPage.summary.kind).toBe("trust");
    if (shippingPage.summary.kind !== "trust") return;
    const items = shippingPage.summary.items.map((item) => [item.icon, toPlainText(item.title!, token), toPlainText(item.body, token)]);
    expect(items).toEqual([
      ["truck", `${DELIVERY_TEXT}.`, "Pre-orders are served first, in the order they were placed."],
      ["map-pin", "Anywhere in India, included.", "Delivery is in the price. Nothing to pay at the door."],
      ["package", "Tracking from dispatch.", "When your Kheelu leaves us, we send you the courier and the tracking details."],
      [
        "currency-inr",
        `Reserved with the refundable ${token.prices.token}?`,
        `Before dispatch, we send a payment link for the remaining ${token.prices.balance} of the ${token.prices.launch} price (incl. GST).`,
      ],
      ["arrow-counter-clockwise", "Refundable until dispatch.", "Change your mind before it leaves us, and you get back everything you’ve paid."],
    ]);
    expect(shippingPage.summary.items[0].title).toBe("{delivery}.");
  });

  it("keeps “refundable” beside the advance and the total (incl. GST) in the same line (D028)", () => {
    if (shippingPage.summary.kind !== "trust") throw new Error("the short version is a trust list");
    const balance = shippingPage.summary.items[3];
    expect(balance.title).toBe("Reserved with the refundable {price:token}?");
    expect(balance.body).toContain("{price:balance} of the {price:launch} price (incl. GST)");
  });

  /* Task 4.7 item 2: a reservation's total is the launch price in both modes, so once the store sells at the full
     price the short version's line and the balance part still name the launch price, never the full one. */
  it("names a reservation's total as the launch price in both modes: the short version's line and the balance part", () => {
    if (shippingPage.summary.kind !== "trust") throw new Error("the short version is a trust list");
    const shortLine = shippingPage.summary.items[3].body;
    const balancePart = part("balance").blocks[0];
    if (balancePart.kind !== "p" || !balancePart.text) throw new Error("the balance part opens with a paragraph");
    const balanceText = balancePart.text;
    for (const offer of [token, full]) {
      const total = `the remaining ${offer.prices.balance} of the ${offer.prices.launch} price (incl. GST)`;
      expect(toPlainText(shortLine, offer), offer.mode).toContain(total);
      expect(toPlainText(balanceText, offer), offer.mode).toContain(total);
    }
    expect(toPlainText(shortLine, full)).toBe("Before dispatch, we send a payment link for the remaining ₹4,500 of the ₹4,999 price (incl. GST).");
    expect(toPlainText(balanceText, full)).toContain("the remaining ₹4,500 of the ₹4,999 price (incl. GST) is due before delivery");
    expect(CODE).not.toContain("{price:headline}");
  });

  it("is followed by the delivery help line, every contact read from seller.ts", () => {
    const help = shippingPage.help!;
    expect(toPlainText(help)).toBe(`Questions about delivery? Call or message us on WhatsApp at ${seller.support.phone}, or email ${seller.support.email}.`);
    expect(help).toContain(`](${seller.support.whatsapp})`);
    expect(help).toContain(`{nowrap:[${seller.support.phone}](${seller.support.tel})}`);
    expect(help).toContain(`[${seller.support.email}](mailto:${seller.support.email})`);
  });
});

describe("the shipping page: its parts (shipping.md folds 3 and 4)", () => {
  it("has the seven parts of the contents list, in order, under the copy page's anchors", () => {
    const contents = PARTS.map((p) => [p.id, toPlainText(p.contents ?? p.title.replace(/\.$/, ""))]);
    expect(contents).toEqual([
      ["when", "When your Kheelu ships"],
      ["where", "Where we deliver, and what it costs"],
      ["balance", "The balance, before dispatch"],
      ["tracking", "Dispatch and tracking"],
      ["address", "Your delivery address"],
      ["problems", "If delivery is late, or something goes wrong"],
      ["seller", "Who you’re buying from, and complaints"],
    ]);
    for (const p of PARTS) expect(p.title.endsWith("."), p.id).toBe(true);
  });

  it("opens “When your Kheelu ships” with the one delivery line, and promises no arrival date or transit time (D022, D037)", () => {
    expect(part("when").blocks[0]).toEqual({ kind: "p", text: "{delivery}. Pre-orders are served first, in the order they were placed." });
    const all = strings(shippingPage).join("\n");
    expect(all).not.toMatch(/\b\d+\s*(?:to|-|–)\s*\d+\s*(?:working\s+)?days\b/i);
    expect(all).not.toMatch(/2026-11-15|15 November/);
  });

  it("reads the payment methods and the two 7-day windows from policies.ts, never retyped (D021, D022, D024)", () => {
    expect(partText("balance")).toContain(`Pay it by ${PAYMENT_METHODS}, and your Kheelu is dispatched.`);
    expect(partText("problems")).toContain(`Tell us within ${FAULTY_REPORT_DAYS} days of receiving it`);
    expect(partText("problems")).toContain(`return it within ${RETURN_DAYS} days of delivery`);
    expect(CODE).not.toMatch(/\b7 days\b|UPI, card or net banking/);
  });

  it("sets the five delivery cases apart by bold leads, not subheadings (shipping.md section 6)", () => {
    const leads = part("problems").blocks.map((b) => (b.kind === "p" ? b.lead : b.kind));
    expect(leads).toEqual(["If the date moves.", "If we can’t deliver.", "If it arrives damaged.", "If it doesn’t arrive.", "And once it arrives,"]);
  });

  it("closes with the shared seller line (no lead: refund and shipping print none), customer care and the grievance block (D032)", () => {
    const blocks = part("seller").blocks;
    expect(blocks.map((b) => b.kind)).toEqual(["seller", "p", "p", "grievance"]);
    expect(blocks[0]).toEqual({ kind: "seller" });
    expect(blocks[3]).toEqual({ kind: "grievance" });
  });

  it("words customer care from seller.ts and names where you order and pay", () => {
    expect(partText("seller")).toContain(
      `Customer care: call or message us on WhatsApp at ${seller.support.phone}, or email ${seller.support.email}. You order on kheelona.com and pay on store.kheelona.com.`,
    );
  });

  it("types no seller fact: no GSTIN (4.4's guard), no number, no email, no WhatsApp address", () => {
    for (const fact of [GSTIN, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_HREF, CONTACT_EMAIL!, "+919187546483", "aman@kheelona.com", "wa.me"]) {
      expect(CODE, fact).not.toContain(fact);
    }
  });

  it("links the refund terms and the grievance officer at anchors their approved pages carry", () => {
    const links = [...strings(shippingPage).join("\n").matchAll(/\]\((\/[a-z-]+)#([a-z-]+)\)/g)].map((m) => [m[1], m[2]]);
    expect(links).toEqual([
      ["/refund", "before-dispatch"],
      ["/refund", "returns"],
      ["/contact", "grievance"],
    ]);
    for (const [path, id] of links) {
      expect(routeFor(path), path).toBeDefined();
      expect(parseMockup(path.slice(1)).getElementById(id), `${path}#${id} on mockup/${path.slice(1)}.html`).not.toBeNull();
    }
  });
});

describe("the shipping page: amounts, placeholders and the close", () => {
  it("types no amount: every price is a {price:…} token (D028; architecture §6.2)", () => {
    expect(SOURCE.split("\n").filter((line) => TYPED_AMOUNT.test(line))).toEqual([]);
    const tokens = new Set([...strings(shippingPage).join("\n").matchAll(/\{price:([a-z]+)\}/g)].map((m) => m[1]));
    expect([...tokens].sort()).toEqual(["balance", "launch", "token"]);
  });

  it("carries no placeholder: the date is the founder's and the lost-parcel line is off the page (D055 items 8 and 9)", () => {
    expect(strings(shippingPage).filter((s) => s.includes("{ph:"))).toEqual([]);
    expect(SOURCE).not.toMatch(/\{ph:|placeholder\(/);
    // Item 9: "If it doesn’t arrive." keeps its approved sentence, word for word, and promises no remedy.
    expect(partText("problems")).toContain("If the tracking stops moving or the parcel doesn’t reach you, call or message us with your order number.");
    expect(partText("problems")).not.toMatch(/lost in transit|send a replacement/);
  });

  it("ends with “Still deciding?”, the Meet Kheelu link carrying shipping-learn and the refund page as a ghost link, no pre-order button", () => {
    expect(shippingPage.close).toEqual({
      title: "Still {hand:deciding?}",
      lead: "See what Kheelu does, what you get and what you pay.",
      actions: [
        { label: "Meet Kheelu", href: "/products/kheelu", cta: "shipping-learn" },
        { label: "Refunds, returns and warranty", href: "/refund" },
      ],
    });
    expect(CTA_IDS).toContain("shipping-learn");
    expect(CTAS["shipping-learn"]).toMatchObject({ role: "secondary", pages: ["/shipping"] });
  });
});

describe("the shipping page: parity and boundaries", () => {
  it("is the template's parity reference word for word: the approved shipping.html as content (test/fixtures/legal/shipping.ts), with the founder's facts", () => {
    /** The fixture with D055 items 8 and 9 applied (shipping.md "Changes after approval"); item 7 is the template's. */
    const LOST_PARCEL = /\s*\{ph:what we do if a parcel is lost in transit[^}]*\}/;
    const withFacts = (value: unknown): unknown =>
      typeof value === "string"
        ? value.replace(LOST_PARCEL, "")
        : Array.isArray(value)
          ? value.map(withFacts)
          : value && typeof value === "object" && !isPlaceholder(value)
            ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withFacts(v)]))
            : value;
    expect(JSON.stringify(shippingFixture)).toMatch(LOST_PARCEL);
    // The fixture is the mockup, a draft; the page is approved as final (D067).
    expect(shippingPage).toEqual({ ...(withFacts(shippingFixture) as object), status: "approved", approvedOn: "2026-10-14" });
  });

  it("is a content module: types from content/types only, values from content, lib and the DS assets (structure §6)", () => {
    const imports = [...CODE.matchAll(/^import\s+(type\s+)?[^;]*?\bfrom\s+"([^"]+)";/gm)].map((m) => [m[2], Boolean(m[1])] as const);
    for (const [path, typeOnly] of imports) {
      expect(path, path).not.toMatch(/^@\/(?:layouts|components|app)\//);
      if (path === "@/content/types") expect(typeOnly, path).toBe(true);
    }
    expect(imports.map(([path]) => path)).toEqual(expect.arrayContaining(["../delivery", "../seller", "../policies"]));
  });
});
