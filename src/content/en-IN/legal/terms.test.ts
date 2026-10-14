import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL, GSTIN, LEGAL_ENTITY, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_HREF } from "@/config/site";
import type { LegalLeadText, LegalPage, LegalPart, OfferMode } from "@/content/types";
import { isModeVariant } from "@/lib/content/mode";
import { isPlaceholder } from "@/lib/content/placeholder";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { TYPED_AMOUNT } from "@/lib/seo/price-lead";
import { COPY_FIXES, KHEELONA_PLUS } from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { termsFixture } from "../../../../test/fixtures/legal/terms";
import { offerCopy } from "../offer";
import { DEFAULT_OG } from "../organization";
import { routeFor } from "../routes";
import { termsPage } from "./terms";

/* The /terms module (task 5.12; structure §5 row terms.html; wiki/site/pages/terms.md, the approved mockup
 * mockup/pages/terms.html, D046). The rendered page against the approved <main> is the route's test; this file holds the
 * rules the plan sets for this page:
 *   - read in token mode (the mode the mockup shows), the module IS the parity fixture copied from the mockup
 *     (test/fixtures/legal/terms.ts), every string equal, with the founder's page facts applied (task 6.7; D055 items 8,
 *     10 and 11: the date, GST as D024 confirms it, the training switch; item 7 is the template's) and section 8's
 *     refund timing as task 7.1b changed it (D056 item 4; deviation V21), and D058's claim fixes (task 8b.1; deviation V33:
 *     Kheelona+ as D058 item 3 words it, the mechanism in the live team's words, the parent app's terms of the live /terms),
 *     and nothing else;
 *   - read in full mode, it is the fixture with exactly the copy page's full-mode variants (terms.md folds 2 and 4, the
 *     two "token mode only" paragraphs of sections 5 and 6) and nothing else changed;
 *   - a draft until the founder approves it (D029); D035's training disclosure and D041's AI-image note;
 *   - the shared facts (entity, support number, WhatsApp, email, the cap, policy numbers, the price sentence) read from
 *     their one source, never retyped; every amount a {price:…} token. */

const SOURCE = readRepoFile("src/content/en-IN/legal/terms.ts");
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const token = buildOffer("token");
const full = buildOffer("full");

/** The module as a parent reads it in one offer mode: every `{ token, full }` resolved to that mode's words, and a
 *  paragraph or short-version point with no words in it left out, as LegalTemplate leaves it out (`saysAnything`). */
function inMode(value: unknown, mode: OfferMode): unknown {
  if (isModeVariant(value)) return value[mode];
  if (Array.isArray(value)) return value.map((v) => inMode(v, mode)).filter((v) => !isEmptyLine(v));
  if (value !== null && typeof value === "object" && !isPlaceholder(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, inMode(v, mode)]));
  }
  return value;
}
function isEmptyLine(value: unknown): boolean {
  if (value === null || typeof value !== "object" || !("text" in value || "lead" in value)) return false;
  const line = value as { lead?: unknown; text?: unknown; kind?: unknown };
  if (line.kind !== undefined && line.kind !== "p") return false;
  const said = (s: unknown) => typeof s === "string" && s.trim() !== "";
  return !said(line.lead) && !said(line.text);
}

/** Everything but the head (`meta`), whose words are compared as a parent and a search engine read them, below. */
const body = (doc: object) => Object.fromEntries(Object.entries(doc).filter(([key]) => key !== "meta"));

/** The GST paragraph and the price breakup as the fixture (the approved page) words them, and the training paragraph's
 *  turn-off slot: the three places the founder's terms facts change (terms.md "Changes after approval"). */
const GST_DOCUMENTS = /^Every order gets a GST invoice\. \{ph:which GST documents[^}]*\}$/;
const PRICE_BREAKUP = /^\{ph:the price breakup[^}]*\}$/;
const TRAINING_SLOT = ": {ph:how a parent turns training off, for example a setting in the parent app}.";

/** Section 8's refund timing, as /refund words it (task 7.1b; D056 item 4; deviation V21): the approved sentence and the
 *  build's (test/e2e/support/deviations.ts COPY_FIXES.terms). */
const REFUND_TIMING = { approved: COPY_FIXES.terms.mockup[0], now: COPY_FIXES.terms.build[0] } as const;
/** Section 9's age-3 sentence in the site's one wording (the founder's answer, D057 item 3; deviation V21). */
const AGE_THREE = { approved: COPY_FIXES.terms.mockup[1], now: COPY_FIXES.terms.build[1] } as const;

/** D058's claim fixes, paragraph by paragraph (task 8b.1; terms.md "Changes after approval (task 8b.1)"; deviation V33):
 *  each approved paragraph and the build's paragraphs in its place. test/e2e/support/deviations.ts CLAIM_FIXES.terms holds
 *  the same words for the rendered page. */
const CLAIMS: readonly { readonly part: string; readonly was: string; readonly now: readonly string[] }[] = [
  {
    part: "preorder",
    was: `In the box: the Kheelu plush toy, a charger and a quick-start card. ${KHEELONA_PLUS.mockup}`,
    now: [`In the box: the Kheelu plush toy, a charger and a quick-start card. ${KHEELONA_PLUS.build}`],
  },
  {
    part: "ages",
    was: "When you set Kheelu up, you enter your child’s age in the parent app. Every reply passes an age-graded safety layer set to that age. You can change it later.",
    now: [
      "When you set Kheelu up, you enter your child’s age in the parent app. You can change it later. The AI model that writes Kheelu’s replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
    ],
  },
  {
    part: "account",
    was: "The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the account.",
    now: [
      "The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the account. You’re responsible for how your child uses Kheelu.",
    ],
  },
  {
    part: "account",
    was: "In the app, you can read every conversation and delete any of them in one tap. Conversations are deleted automatically after 36 months.",
    now: [
      "In the app, you can read every conversation word for word, a few minutes after it ends, with a daily summary, search, and a look back over the week or the month. Conversations are deleted automatically after 36 months.",
      "The parent app is free. You sign in with your phone number and a one-time code. Keep the code to yourself, and tell us if you think someone else is using your account.",
      "Conversations with Kheelu need your home Wi‑Fi. Stories and songs you’ve downloaded play without it.",
      "Don’t try to break into our systems, copy the service, or use the app or Kheelu to harm anyone. If you do, we can close your account.",
      "You can stop using the app and delete your account at any time, in its privacy settings. That deletes the account, your child’s profile, and their conversations and voice recordings.",
    ],
  },
  {
    part: "toy",
    was: "Kheelu uses AI to understand and answer your child. Its stories and answers come from a curated, closed content library, and every reply passes an age-graded safety layer. We test it before launch by trying to make it say unsafe things, and when it isn’t sure, it says it doesn’t know rather than guess. Even so, an answer can sometimes be wrong. Kheelu doesn’t replace you: stay close, and read its conversations in the parent app.",
    now: [
      "Kheelu uses AI to understand and answer your child. The AI model that writes its replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. It cannot browse or search the web.",
      "We test it before launch by trying to make it say unsafe things, and when it isn’t sure, it says it doesn’t know rather than guess. Even so, an answer can sometimes be wrong, so treat its replies as conversation, not advice. Kheelu doesn’t replace you: stay close, and read its conversations in the parent app.",
    ],
  },
];

/** The fixture body with the founder's page facts applied: the date (item 8), "Every order gets a GST invoice." alone
 *  and no price breakup (item 10), "with a switch in the parent app" (item 11); section 8's refund timing as task 7.1b
 *  changed it; section 9's age-3 sentence (D057 item 3); and D058's claim fixes (task 8b.1). */
function withTermsFacts(doc: LegalPage): LegalPage {
  const claimed = doc.parts.map((p) => ({
    ...p,
    blocks: p.blocks.flatMap((b) => {
      const claim = CLAIMS.find((c) => c.part === p.id && b.kind === "p" && b.text === c.was);
      return claim ? claim.now.map((text) => ({ ...b, text })) : [b];
    }),
  })) as LegalPart[];
  const parts = claimed.map((p) => {
    if (p.id === "ages") {
      return {
        ...p,
        blocks: p.blocks.map((b) =>
          b.kind === "p" && typeof b.text === "string" && b.text.includes(AGE_THREE.approved) ? { ...b, text: b.text.replace(AGE_THREE.approved, AGE_THREE.now) } : b,
        ),
      };
    }
    if (p.id === "returns") {
      return {
        ...p,
        blocks: p.blocks.map((b) =>
          b.kind === "p" && typeof b.text === "string" && b.text.includes(REFUND_TIMING.approved) ? { ...b, text: b.text.replace(REFUND_TIMING.approved, REFUND_TIMING.now) } : b,
        ),
      };
    }
    if (p.id === "price") {
      return {
        ...p,
        blocks: p.blocks.flatMap((b) => {
          if (b.kind !== "p" || typeof b.text !== "string") return [b];
          if (PRICE_BREAKUP.test(b.text)) return [];
          return GST_DOCUMENTS.test(b.text) ? [{ ...b, text: "Every order gets a GST invoice." }] : [b];
        }),
      };
    }
    if (p.id === "training") {
      return {
        ...p,
        blocks: p.blocks.map((b) =>
          b.kind === "p" && typeof b.text === "string" && b.text.includes(TRAINING_SLOT) ? { ...b, text: b.text.replace(TRAINING_SLOT, " with a switch in the parent app.") } : b,
        ),
      };
    }
    return p;
  });
  return { ...doc, status: "draft", approvedOn: "2026-10-14", parts } as LegalPage;
}
const FACTS_FIXTURE = withTermsFacts(body(termsFixture) as unknown as LegalPage);

const PARTS: readonly LegalPart[] = termsPage.parts;
const part = (id: string): LegalPart => {
  const found = PARTS.find((p) => p.id === id);
  if (!found) throw new Error(`the terms page has no part #${id}`);
  return found;
};
/** A part's paragraphs as a parent reads them in a mode, the bold lead and the rest (paragraphs with no words left out). */
const paragraphs = (id: string, mode: OfferMode) =>
  part(id)
    .blocks.flatMap((b) => (b.kind === "p" ? [b] : []))
    .map((b) => [b.lead, b.text].flatMap((c) => (c === undefined ? [] : [toPlainText(c, buildOffer(mode))])).join(" "))
    .filter((s) => s.trim() !== "");

describe("the terms page: the route and its head", () => {
  it("is the module the URL plan names for /terms (routes.ts: legal/terms)", () => {
    expect(routeFor("/terms")).toMatchObject({ kind: "legal", module: "legal/terms" });
    expect(termsPage.slug).toBe("terms");
  });

  it("carries the copy page's meta title, the same in both modes, within 60 characters and naming the brand once", () => {
    for (const offer of [token, full]) {
      const title = toPlainText(termsPage.meta.title, offer);
      expect(title).toBe("Kheelu pre-order terms · Kheelona");
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title.match(/Kheelona/g)).toHaveLength(1);
    }
  });

  it("carries the copy page's meta description per mode, leading with the total (D028), within 155 characters", () => {
    const tokenText = toPlainText(termsPage.meta.description, token);
    const fullText = toPlainText(termsPage.meta.description, full);
    expect(tokenText).toBe(
      "Kheelu pre-order terms: ₹4,999 (incl. GST), reserved with a refundable ₹499 advance. Paying, delivery, cancelling, returns and using Kheelu.",
    );
    expect(fullText).toBe(
      "Kheelu pre-order terms: ₹7,999 (incl. GST), paid in full when you order. Paying, delivery, cancelling, returns and using Kheelu and its app.",
    );
    for (const text of [tokenText, fullText]) expect(text.length).toBeLessThanOrEqual(155);
    // pageMeta refuses a description whose first amount is not the live headline, or a typed amount (D028, task 2.13).
    for (const offer of [token, full]) expect(() => pageMeta({ ...termsPage.meta, path: "/terms", offer })).not.toThrow();
  });

  it("shares the default card (a text-only page: no image of its own)", () => {
    expect(termsPage.meta.og).toBe(DEFAULT_OG);
  });
});

describe("the terms page: the approved mockup's words (parity with the fixture copied from it)", () => {
  it("read in token mode, every block, line and link equals test/fixtures/legal/terms.ts with the founder's facts", () => {
    // The three places are in the fixture to be changed (not vacuous), and changed.
    for (const approved of [GST_DOCUMENTS, PRICE_BREAKUP]) {
      const inText = new RegExp(approved.source.slice(1, -1));
      expect(JSON.stringify(body(termsFixture))).toMatch(inText);
      expect(JSON.stringify(FACTS_FIXTURE)).not.toMatch(inText);
    }
    expect(JSON.stringify(body(termsFixture))).toContain(TRAINING_SLOT);
    expect(JSON.stringify(FACTS_FIXTURE)).not.toContain(TRAINING_SLOT);
    // And D058's claim fixes (task 8b.1), each paragraph there to be changed.
    for (const claim of CLAIMS) {
      expect(JSON.stringify(body(termsFixture)), claim.was).toContain(JSON.stringify(claim.was));
      expect(JSON.stringify(FACTS_FIXTURE), claim.was).not.toContain(JSON.stringify(claim.was));
    }
    // And section 8's refund timing (task 7.1b).
    expect(JSON.stringify(body(termsFixture))).toContain(REFUND_TIMING.approved);
    expect(JSON.stringify(FACTS_FIXTURE)).not.toContain(REFUND_TIMING.approved);
    expect(JSON.stringify(FACTS_FIXTURE)).toContain(REFUND_TIMING.now);
    expect(inMode(body(termsPage), "token")).toEqual(FACTS_FIXTURE);
  });

  it("read in token mode, the head says what the fixture's head says", () => {
    expect(toPlainText(termsPage.meta.title, token)).toBe(termsFixture.meta.title);
    expect(toPlainText(termsPage.meta.description, token)).toBe(termsFixture.meta.description);
  });
});

describe("the terms page: full mode (terms.md folds 2 and 4, sections 5 and 6)", () => {
  /** The fixture as the copy page says full mode reads: four changes, everything else unchanged. */
  const expectedFull = (() => {
    const fixture = FACTS_FIXTURE;
    if (fixture.summary.kind !== "points") throw new Error("terms' short version is numbered points");
    const points: LegalLeadText[] = [...fixture.summary.points];
    points[0] = { lead: "What you pay.", text: "{price:full} (incl. GST), paid in full when you order." };
    points[1] = {
      lead: "Changed your mind before dispatch?",
      text: "Cancel any time before dispatch for a full refund, no reason needed. We start it within 2 working days.",
    };
    const parts = fixture.parts.map((p) => {
      switch (p.id) {
        case "price":
          // "the first two paragraphs become" one.
          return {
            ...p,
            blocks: [
              { kind: "p", text: "Kheelu costs {price:full} (incl. GST), paid in full when you order. There is no advance and no balance." },
              ...p.blocks.slice(2),
            ],
          };
        case "payment":
          // "(token mode only) The ₹4,500 balance is paid by a payment link …"
          return { ...p, blocks: p.blocks.filter((_, i) => i !== 2) };
        case "cancel":
          // "(token mode only) If you don't pay the balance, we remind you twice …"
          return { ...p, blocks: p.blocks.filter((_, i) => i !== 2) };
        default:
          return p;
      }
    });
    return { ...fixture, summary: { ...fixture.summary, points }, parts };
  })();

  it("read in full mode, it is the fixture with exactly those changes", () => {
    expect(inMode(body(termsPage), "full")).toEqual(expectedFull);
  });

  it("the short version's first point is the price sentence beside every chilli button, in each mode (D028, D041 option (d))", () => {
    if (termsPage.summary.kind !== "points") throw new Error("terms' short version is numbered points");
    expect(termsPage.summary.points[0]).toEqual({ lead: "What you pay.", text: offerCopy.sentence });
  });

  it("names no token or balance amount in full mode, and never the cap", () => {
    const words = JSON.stringify(inMode(body(termsPage), "full"));
    expect(words).not.toMatch(/\{price:(?:token|balance|headline)\}/);
    expect(words).not.toMatch(/first \d+ units/);
  });

  it("drops the two balance paragraphs in full mode, and keeps them in token mode", () => {
    const balance = /balance is paid by a payment link/;
    const unpaid = /If you don’t pay the balance/;
    expect(paragraphs("payment", "token").some((p) => balance.test(p))).toBe(true);
    expect(paragraphs("payment", "full").some((p) => balance.test(p))).toBe(false);
    expect(paragraphs("cancel", "token").some((p) => unpaid.test(p))).toBe(true);
    expect(paragraphs("cancel", "full").some((p) => unpaid.test(p))).toBe(false);
  });
});

describe("the terms page: a draft until the founder approves it (D029)", () => {
  it("is a draft, so the draft note shows and the production build refuses it (ADR-004)", () => {
    expect(termsPage.status).toBe("draft");
  });

  it("is last updated on the founder's date, 14 October 2026 (D055 item 8; terms.md fold 1)", () => {
    expect(termsPage.approvedOn).toBe("2026-10-14");
  });

  it("carries no placeholder: every slot filled or ruled off by the founder (D055 items 10 and 11)", () => {
    expect(SOURCE).not.toMatch(/\{ph:|placeholder\(/);
    expect(paragraphs("price", "token")).toContain("Every order gets a GST invoice.");
    expect(paragraphs("price", "token").join(" ")).not.toMatch(/breakup|HSN|receipt voucher/);
  });
});

describe("the terms page: what the decisions require it to say", () => {
  it("D035: Kheelona's own model learns from voice recordings and transcripts, on by default, and a parent can turn it off", () => {
    const [first, second] = paragraphs("training", "token");
    expect(first).toContain("Kheelona’s own AI model learns from your child’s voice recordings and conversation transcripts.");
    // D055 item 11: turned off with a switch in the parent app, as on /privacy.
    expect(first).toContain("This is on by default, and you can turn it off at any time with a switch in the parent app.");
    // D020 stays scoped to the outside providers.
    expect(first).toContain("Our outside speech and AI providers never train on your child’s voice.");
    expect(second).toContain("Privacy");
    expect(JSON.stringify(part("training"))).toContain("(/privacy#training)");
  });

  it("D041: the AI-image disclosure lives here, under its own part, worded as the copy page", () => {
    expect(part("images").title).toBe("Images on this website.");
    expect(paragraphs("images", "token")).toEqual([
      "This website may use AI-generated images, including pictures of children and families. They are illustrations, not photos of our customers. Our films are different: they show real pilot families, filmed with their permission.",
    ]);
  });

  it("D025: the speech disclaimer, verbatim, opens the toy part", () => {
    expect(paragraphs("toy", "token")[0]).toBe(
      "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
    );
  });

  it("closes with the shared seller and grievance blocks, the seller card led by “Seller:” (D032; seller-lines.ts renders them)", () => {
    expect(part("contact").blocks.filter((b) => b.kind === "grievance" || b.kind === "seller")).toEqual([
      { kind: "seller", lead: "Seller:" },
      { kind: "grievance" },
    ]);
  });

  it("keeps the anchors other pages link to (terms.md: #payment, #price, #cancel, #delivery, #returns, #training)", () => {
    const ids = PARTS.map((p) => p.id);
    for (const id of ["payment", "price", "cancel", "delivery", "returns", "training"]) expect(ids).toContain(id);
  });

  it("links back to the product page from the close, with no tracking value (strategy §5 policy row)", () => {
    expect(termsPage.close.actions).toEqual([{ label: "Meet Kheelu", href: "/products/kheelu" }]);
  });
});

describe("the terms page: shared facts are read, never retyped", () => {
  /* The module types no amount, not even in a comment, by the one pattern task 2.1's guard and pageMeta use (TYPED_AMOUNT,
   * src/lib/seo/price-lead.ts). The approved price-breakup placeholder, whose note said "delivery ₹0", is off the page
   * (D055 item 10). */
  it("types no amount: every price is a {price:…} token", () => {
    expect(SOURCE).not.toMatch(TYPED_AMOUNT);
  });

  it("types no support number, WhatsApp address, email, legal entity or GSTIN: seller.ts holds them", () => {
    for (const fact of [SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_HREF, CONTACT_EMAIL!, LEGAL_ENTITY, GSTIN, "919187546483"]) {
      expect(CODE, fact).not.toContain(fact);
    }
    expect(CODE).toMatch(/from "\.\.\/seller"/);
  });

  it("reads the cap, the policy numbers and the price sentence from their modules", () => {
    expect(CODE).not.toMatch(/first 500 units/);
    expect(CODE).toMatch(/\bCAP_UNITS_TEXT\b/);
    expect(CODE).toMatch(/from "\.\.\/policies"/);
    expect(CODE).toMatch(/offerCopy\.sentence/);
    // The policy numbers: no "7 days", "6-month", "2 working days" or "36 months" typed as words.
    expect(CODE).not.toMatch(/\b(?:7|6|2|36) (?:days|working days|months)\b|\b(?:7|6)-(?:day|month)\b|5-7/);
  });

  it("imports only content types, lib, config and other content modules (structure §6)", () => {
    const imports = [...SOURCE.matchAll(/from "([^"]+)"/g)].map((m) => m[1]);
    for (const path of imports) expect(path, path).toMatch(/^(?:@\/content\/types|@\/lib\/|@\/config\/|\.\.\/[a-z-]+$)/);
  });
});
