import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GSTIN } from "@/config/site";
import type { LegalBlock, LegalPart, ToolsBlock } from "@/content/types";
import { CAMPAIGN_COOKIE } from "@/lib/campaign";
import { CLICK_ID_COOKIE } from "@/lib/click-id";
import { toPlainText } from "@/lib/content/plain-text";
import { isPlaceholder } from "@/lib/content/placeholder";
import { buildOffer } from "@/lib/offer/offer";
import { THANKS_COOKIE, THANKS_COOKIE_MAX_AGE_SECONDS } from "@/lib/store/thanks-session";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { words } from "../../../../test/support/mockup-compare";
import { DEFAULT_OG } from "../organization";
import { GRIEVANCE_ACK_HOURS, GRIEVANCE_RESOLUTION, RETENTION_LINE, RETENTION_MONTHS } from "../policies";
import { routeFor } from "../routes";
import { seller } from "../seller";
import { ORDER_DATA_LOCATION, privacyPage } from "./privacy";

/* The /privacy module (task 5.11; structure §5 row privacy.html; wiki/site/pages/privacy.md, the approved mockup
 * mockup/pages/privacy.html, D046). Its words against the approved page are the route's test (every word of <main>, the
 * markup with it); this file holds the rules the plan sets for this page: a draft until the founder approves it (D029),
 * every measuring tool in a block of its own and never a count of them (privacy.md section 5), the order-data location a
 * placeholder until the Supabase move is confirmed (D047, ADR-009), Kheelona's own model disclosed as D035 asks, the
 * cookies named as the code names them, and the shared facts (seller, policy numbers) read, never retyped. */

/* The route reads the live offer for its template (the rendered-page count rule); the page names no amount. */
const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

const SOURCE = readRepoFile("src/content/en-IN/legal/privacy.ts");
const token = buildOffer("token");
const full = buildOffer("full");

/** Every string anywhere in the module (deep), for the page-wide word rules. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object") for (const v of Object.values(value)) strings(v, out);
  return out;
}
const TEXT = strings(privacyPage)
  .map((s) => toPlainText(s))
  .join("\n");

/** The parts as the content shape types them (the module's literal types are narrower, part by part). */
const PARTS: readonly LegalPart[] = privacyPage.parts;

const part = (id: string): LegalPart => {
  const found = PARTS.find((p) => p.id === id);
  if (!found) throw new Error(`the privacy page has no part #${id}`);
  return found;
};
/** A part's words, its answer line and blocks together. */
const partText = (id: string) => strings(part(id)).map((s) => toPlainText(s)).join("\n");
const toolsBlocks = PARTS.flatMap((p) => p.blocks).filter((b): b is ToolsBlock => b.kind === "tools");
const tool = (name: string) => {
  const found = toolsBlocks.flatMap((b) => b.tools).find((t) => toPlainText(t.name) === name);
  if (!found) throw new Error(`no tool block is named ${name}`);
  return found;
};
/** A list block's lead labels, in order. */
const leadsOf = (blocks: readonly LegalBlock[]) =>
  blocks.flatMap((b) => (b.kind === "list" ? b.items.map((item) => (typeof item === "string" ? undefined : item.lead)) : []));

describe("the privacy page: the route and its head", () => {
  it("is the module the URL plan names for /privacy (routes.ts: legal/privacy)", () => {
    expect(routeFor("/privacy")).toMatchObject({ kind: "legal", module: "legal/privacy" });
    expect(privacyPage.slug).toBe("privacy");
  });

  it("carries the copy page's meta title and description, within 60 and 155 characters, and the default share card", () => {
    const title = toPlainText(privacyPage.meta.title);
    const description = toPlainText(privacyPage.meta.description);
    expect(title).toBe("Kheelona privacy policy, in plain words");
    expect(description).toBe(
      "How Kheelona handles your data and your child’s: what we collect, every tool we use, 36 months for conversations, and how to opt out or delete.",
    );
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(privacyPage.meta.og).toBe(DEFAULT_OG);
  });

  it("opens as the copy page's header: the eyebrow, the recommended H1 with its Hand accent, the lead, and no art", () => {
    expect(privacyPage.hero).toEqual({
      eyebrow: "Privacy policy",
      title: "Privacy, in {hand:plain words.}",
      lead: "What we collect on kheelona.com, in our store, through Kheelu and in its parent app; why; who else handles it; and what you can do about it.",
    });
  });
});

describe("the privacy page: a draft until the founder approves it (D029)", () => {
  it("is a draft, so the draft note shows and the production build refuses it (ADR-004)", () => {
    expect(privacyPage.status).toBe("draft");
  });

  it("prints its approval date as the copy page's placeholder, with no open-item id (privacy.md fold 1)", () => {
    expect(isPlaceholder(privacyPage.approvedOn)).toBe(true);
    expect(privacyPage.approvedOn).toMatchObject({ id: null, note: "the date the founder approves this text" });
  });
});

describe("the privacy page: its parts", () => {
  it("has the fourteen parts of the contents list, in order, under the copy page's anchors (privacy.md fold 3)", () => {
    const contents = PARTS.map((p) => [p.id, toPlainText(p.contents ?? p.title.replace(/\.$/, ""))]);
    expect(contents).toEqual([
      ["who", "Who we are"],
      ["kheelu", "Kheelu, the parent app and your child’s voice"],
      ["training", "Kheelona’s own model"],
      ["store", "When you pre-order"],
      ["measuring", "How we measure visits"],
      ["choices", "Your choices about cookies and tracking"],
      ["who-else", "Everyone who handles your data"],
      ["keep", "How long we keep things"],
      ["rights", "Deleting, and your other rights"],
      ["never", "What we never do"],
      ["security", "Keeping data safe"],
      ["films", "Films of real families"],
      ["law", "Which law applies"],
      ["contact", "Questions and complaints"],
    ]);
  });

  it("closes with the shared grievance and seller blocks (D032), the seller card led by “Who we are:”", () => {
    expect(part("contact").blocks.filter((b) => b.kind === "grievance" || b.kind === "seller")).toEqual([
      { kind: "grievance" },
      { kind: "seller", lead: "Who we are:" },
    ]);
  });

  it("ends with the link back to Meet Kheelu and the related policies, no pre-order button and no tracking value", () => {
    expect(privacyPage.close).toEqual({
      actions: [{ label: "Meet Kheelu", href: "/products/kheelu" }],
      also: {
        label: "Also read:",
        links: [
          { label: "Terms", href: "/terms" },
          { label: "Refunds", href: "/refund" },
          { label: "Shipping", href: "/shipping" },
          { label: "Safety", href: "/safety" },
        ],
      },
    });
  });
});

describe("the privacy page: every measuring tool named in a block of its own, never counted (privacy.md section 5)", () => {
  it("has one tools list, in “How we measure visits and advertising”", () => {
    expect(toolsBlocks).toHaveLength(1);
    expect(part("measuring").blocks.filter((b) => b.kind === "tools")).toEqual(toolsBlocks);
  });

  it("names each tool once, in the copy page's order, each with words of its own", () => {
    const tools = toolsBlocks[0].tools;
    expect(tools.map((t) => toPlainText(t.name))).toEqual([
      "Vercel Web Analytics",
      "Ahrefs Web Analytics",
      "Google Analytics",
      "Meta Pixel",
      "Meta Conversions API",
      "PostHog",
      "Our own cookies",
    ]);
    for (const t of tools) expect(t.blocks.length, toPlainText(t.name)).toBeGreaterThan(0);
  });

  /* The live page had to retire a count of its tools four times (privacy.md section 5; test/analytics-tags.test.ts): a
   * count expires on the next tool, so none may appear, in any form. Every pattern is built from one number, in words or
   * digits, so a form one pattern knows the others know too. In the module's words, one string per line (a block's
   * `kind` is a string too); the rendered page below is checked as a parent reads it, every block on one line. */
  const N = String.raw`(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|(?:a )?dozen|\d+)`;
  const TOOL_COUNTS = [
    // A number, then up to four words (a list's comma or ampersand included), then what a count calls the tools.
    new RegExp(String.raw`\b${N}\b(?:[^\S\n]+[\w’',&-]+){0,4}?[^\S\n]+(?:tools?|trackers?|services|scripts|tags)\b`, "i"),
    // "All seven": a bare count. The approved who-we-are line counts places ("in all four places"), not tools.
    new RegExp(String.raw`\ball ${N}\b(?![^\S\n]+places\b)`, "i"),
    new RegExp(String.raw`\b(?:most|least) \w+ of (?:the|these|those|our) ${N}\b`, "i"),
    // "These seven", "the six below": a count that names its tools in no word at all. A length of time is not a count.
    new RegExp(String.raw`\b(?:the|these|those|our) ${N}\b(?![^\S\n]+(?:months|hours|days|years)\b)`, "i"),
    new RegExp(String.raw`\bof the ${N}\b`, "i"),
  ];

  /* The guard is proved on the counts a copy change would most naturally add (review of 5.11): a guard that lets one of
   * these through is a rule that does not outlive the copy. */
  it.each([
    "We use seven analytics and advertising tools.",
    "We use seven measuring tools.",
    "Seven tools measure visits.",
    "We use 7 analytics, advertising and session tools.",
    "Here is what all seven do.",
    "All seven of them run on this site.",
    "PostHog is the most detailed of the seven.",
    "Blocking stops the four that run in your browser.",
    // Round 2: a one-word edit of the measuring part's own intro, the digit form of "all seven", a number past ten.
    "These seven run on kheelona.com.",
    "All 7 load at once.",
    "We use eleven tools.",
    // The other natural counts round 2 found open: a count names its tools in other words, or none.
    "Of the seven, one follows you.",
    "Here are the seven we use.",
    "The six below set cookies.",
    "We use seven trackers.",
    "Six analytics and advertising scripts run here.",
  ])("the count guard catches a planted count: %s", (plant) => {
    expect(TOOL_COUNTS.some((pattern) => pattern.test(plant))).toBe(true);
  });

  it("never counts the tools, in words or digits", () => {
    for (const pattern of TOOL_COUNTS) expect(TEXT).not.toMatch(pattern);
  });

  /* The module's words are one string per line, so a count split across a list item's bold lead and its text ("We use
   * seven" then "analytics tools") is never seen whole there, and the words the template adds (legal/shared.ts) are not
   * the module's at all. The route as a parent reads it holds both. */
  it("never counts the tools on the rendered page either: the template's words, and a lead read with its text", async () => {
    getOffer.mockResolvedValue(token);
    const { default: PrivacyPage } = await import("@/app/(site)/privacy/page");
    const html = renderToStaticMarkup((await PrivacyPage()) as ReactElement);
    const main = new DOMParser().parseFromString(`<main>${html}</main>`, "text/html").querySelector("main")!;
    const page = words(main);
    expect(page).toContain(toPlainText(privacyPage.hero.lead));
    for (const pattern of TOOL_COUNTS) expect(page).not.toMatch(pattern);
  }, 60_000);

  it("names the cookies as the code names them, and kh_order's life as the code sets it", () => {
    const own = tool("Our own cookies").blocks;
    expect(leadsOf(own)).toEqual([CAMPAIGN_COOKIE, CLICK_ID_COOKIE, THANKS_COOKIE]);
    const hours = THANKS_COOKIE_MAX_AGE_SECONDS / 3600;
    expect(strings(own).map((s) => toPlainText(s)).join(" ")).toContain(`lets the confirmation page show your order, for ${hours} hours.`);
    expect(partText("keep")).toContain(`${CAMPAIGN_COOKIE} and ${CLICK_ID_COOKIE} for as long as your visit lasts; ${THANKS_COOKIE} for ${hours} hours.`);
  });
});

describe("the privacy page: where order data lives (D047, ADR-009)", () => {
  it("prints Supabase's region as ORDER_DATA_LOCATION, the one value the main session sets once the move is confirmed", () => {
    const recipients = part("who-else").blocks.find((b) => b.kind === "recipients");
    expect(recipients?.kind).toBe("recipients");
    const rows = recipients?.kind === "recipients" ? recipients.rows : [];
    expect(rows.filter((r) => r.who === "Supabase")).toEqual([{ who: "Supabase", what: "Stores your order", where: ORDER_DATA_LOCATION }]);
    // Other regions are the same placeholder words, so the source shows which row reads the value: Supabase's alone.
    expect(SOURCE.match(/\bwhere: ORDER_DATA_LOCATION\b/g), "read by one recipient row").toHaveLength(1);
  });

  /* Until the founder confirms the move to Mumbai (architecture §15.6), the production build refuses the page; the main
   * session then writes India here (ADR-009: if the move slips past launch, Australia, never a guess). */
  it("is a placeholder until the move is confirmed, never a guessed country", () => {
    if (ORDER_DATA_LOCATION.startsWith("{ph:")) expect(ORDER_DATA_LOCATION).toBe("{ph:region}");
    else expect(["India", "Australia"]).toContain(ORDER_DATA_LOCATION);
  });
});

describe("the privacy page: Kheelona's own model (D035)", () => {
  it("says what it uses, who uses it, that it is on by default and that a parent can turn it off", () => {
    const training = partText("training");
    expect(training).toContain("Kheelona’s own AI model does learn from conversations");
    expect(training).toContain("your child’s voice recordings and the transcripts of their conversations with Kheelu.");
    expect(training).toContain("Kheelona, to train our own model. We don’t sell it.");
    // A list item's bold lead and its text are two strings: "It’s on by default." then the rest.
    expect(training).toContain("It’s on by default.\nYou can turn it off at any time:");
    expect(training).toContain("From then on, your child’s conversations are not used to train our model.");
  });

  it("holds the facts the founder has not given yet as visible placeholders: why, where and how to turn it off", () => {
    const training = partText("training");
    for (const note of ["the purpose in the founder’s words", "where our model is trained", "how a parent turns training off"]) {
      expect(training).toContain(`[PLACEHOLDER: ${note}`);
    }
  });

  it("keeps the providers' line scoped to the providers, and the short version says the model learns unless turned off", () => {
    expect(partText("training")).toContain("Our outside speech and AI providers never train on your child’s voice.");
    expect(TEXT).toContain("Our own model learns, unless you turn it off.");
    expect(TEXT).not.toMatch(/your child[’']s voice is never used|we keep nothing|never used to train AI/i);
  });

  it("puts the 36-month retention beside the training use (D035, D020)", () => {
    expect(partText("keep")).toContain(RETENTION_LINE);
    expect(partText("kheelu")).toContain(`Conversations stay in your parent app for ${RETENTION_MONTHS} months`);
  });
});

describe("the privacy page: shared facts read, never retyped", () => {
  it("is a content module: it imports content shapes, lib and its sibling content only (structure §6)", () => {
    const imports = [...SOURCE.matchAll(/\bfrom\s+"([^"]+)"/g)].map((m) => m[1]);
    expect(imports.sort()).toEqual(["../organization", "../policies", "../seller", "@/content/types", "@/lib/content/placeholder"]);
  });

  it("reads the support number, email, WhatsApp address and registered office from seller.ts, and never types the GSTIN", () => {
    for (const fact of [seller.support.phone, seller.support.email, seller.support.whatsapp, seller.support.tel, seller.addressLine, GSTIN, "919187546483"]) {
      expect(SOURCE, fact).not.toContain(fact);
    }
    expect(TEXT).toContain(`Our registered office is at ${seller.addressLine}.`);
    expect(TEXT).toContain(`or at ${seller.support.email}.`);
  });

  it("reads every policy number from policies.ts: retention, the complaint promise", () => {
    expect(SOURCE).not.toMatch(/\b36\b|\b48\b|one month/);
    expect(TEXT).toContain(`We delete transcripts automatically after ${RETENTION_MONTHS} months.`);
    expect(TEXT).toContain(`We acknowledge every complaint within ${GRIEVANCE_ACK_HOURS} hours.`);
    expect(TEXT).toContain(`And we resolve it within ${GRIEVANCE_RESOLUTION}.`);
    expect(TEXT).toContain(`We acknowledge every request within ${GRIEVANCE_ACK_HOURS} hours and answer it within ${GRIEVANCE_RESOLUTION}.`);
  });

  it("names no amount and does not change with the offer: the same words in both modes", () => {
    expect(SOURCE).not.toMatch(/\{price:|\{delivery\}|₹/);
    const words = (offer: typeof token) => strings(privacyPage).map((s) => toPlainText(s, offer)).join("\n");
    expect(words(full)).toBe(words(token));
  });
});
