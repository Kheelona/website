import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GSTIN } from "@/config/site";
import type { LegalBlock, LegalPart, ToolsBlock } from "@/content/types";
import { CAMPAIGN_COOKIE } from "@/lib/campaign";
import { CLICK_ID_COOKIE } from "@/lib/click-id";
import { toPlainText } from "@/lib/content/plain-text";
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
 * every measuring tool in a block of its own and never a count of them (privacy.md section 5), the order-data location
 * D047's Australia until the founder says the Supabase store has moved (D055 item 24, ADR-009), Kheelona's own model
 * disclosed as D035 asks in the founder's words (D055 item 12), the founder's other page facts (task 6.7: D055 items 7,
 * 8 and 13-24, D054 item 12; no placeholder left), the cookies named as the code names them, and the shared facts
 * (seller, policy numbers) read, never retyped. */

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

  it("is last updated on the founder's date, 14 October 2026 (D055 item 8; privacy.md fold 1)", () => {
    expect(privacyPage.approvedOn).toBe("2026-10-14");
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

  /* The founder chose not to answer the move question (D055 item 24), so the page states the fact D047 records, the
   * Sydney region, until he says the store has moved; the main session then writes India here (ADR-009). */
  it("is D047's Australia until the founder says the move is done, never a guessed country", () => {
    expect(ORDER_DATA_LOCATION).toBe("Australia");
  });
});

describe("the privacy page: Kheelona's own model (D035)", () => {
  it("says what it uses, who uses it, that it is on by default and that a parent can turn it off", () => {
    const training = partText("training");
    expect(training).toContain("Kheelona’s own AI model does learn from conversations");
    expect(training).toContain("your child’s voice recordings and the transcripts of their conversations with Kheelu.");
    expect(training).toContain("Kheelona, to train our own model. We don’t sell it.");
    // A list item's bold lead and its text are two strings: "It’s on by default." then the rest.
    expect(training).toContain("It’s on by default.\nYou can turn it off at any time, with a switch in the parent app.");
    expect(training).toContain("From then on, your child’s conversations are not used to train our model.");
  });

  it("says why, where, how to turn it off and what happens to what was used, in the founder's words (D055 item 12)", () => {
    const training = partText("training");
    expect(training).toContain("Why:\nto make Kheelu better at understanding and answering children aged 3 to 7.");
    expect(training).toContain("Where:\nIndia, on Google Cloud.");
    expect(training).toContain(
      "We take them out of our training data. A model already trained keeps what it learned, but they are never used again.",
    );
    expect(training).toContain("Turning it off changes nothing else about how Kheelu or the parent app works.");
    expect(TEXT).toContain("It’s on by default. You can turn it off with a switch in the parent app.");
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
  it("is a content module: it imports content shapes and its sibling content only (structure §6)", () => {
    const imports = [...SOURCE.matchAll(/\bfrom\s+"([^"]+)"/g)].map((m) => m[1]);
    expect(imports.sort()).toEqual(["../organization", "../policies", "../seller", "@/content/types"]);
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

/* Task 6.7: the founder's answers of 2026-10-14 (D055 items 7, 8 and 13-24; D054 item 12), each in the place of the
 * placeholder it fills; the lines he ruled off are gone. The route's test holds every word against the mockup with these
 * facts applied (test/e2e/support/page-facts.ts); these pin the facts themselves. */
describe("the privacy page: the founder's page facts (D055)", () => {
  it("has no placeholder left: no token, no data helper, no draft date", () => {
    expect(SOURCE).not.toMatch(/\{ph:|placeholder\(/);
    expect(TEXT).not.toMatch(/PLACEHOLDER/);
  });

  /* D055 item 14, as the live /privacy's app sections word it since task 8b.1 (D058 item 1; map §1 P3-P8): the child's
     profile, the account, Kheelu's setup, and the Wi-Fi network's name on the phone, not in the account (supersedes D055
     item 13's account line). */
  it("names what the parent app keeps: the child's profile, the account and its one-time code, Kheelu's setup; no location (item 14; D058)", () => {
    const kheelu = partText("kheelu");
    expect(kheelu).toContain(
      "Your child’s profile:\ntheir first name, pronouns and languages, which the parent app asks for so Kheelu can talk with them properly, and a photo only if you add one.",
    );
    expect(kheelu).toContain(
      "Your parent-app account:\nyour phone number, which you sign in with using a one-time code, and your name and how you’re related to your child, if you add them.",
    );
    expect(kheelu).toContain(
      "Kheelu’s setup:\nits serial or device ID, the name you give it, its battery and Wi‑Fi strength, when it was last online, and your phone’s model and operating system.",
    );
    expect(kheelu).toContain(
      "The parent app collects no location. Your phone asks for location permission while you set Kheelu up. That is only because Android and iPhone require it before an app can read the name of your Wi‑Fi network, and that name stays on your phone. Your account doesn’t keep the Wi‑Fi password. The app has no advertising or analytics tools.",
    );
    expect(kheelu).not.toMatch(/alert|network Kheelu joins/i);
  });

  it("uses recordings for the reply and training only (item 13), keeps consent in the founder's two sentences (item 15), and names the processors in section 7 (D058 item 6)", () => {
    const kheelu = partText("kheelu");
    expect(kheelu).toContain(
      "Besides Kheelu’s reply and that training, we use them for nothing else. We keep them unless you turn off Save voice recordings in the parent app’s privacy settings; then we keep the text only.",
    );
    expect(kheelu).toContain(
      "Setting Kheelu up in the parent app is how a parent or guardian agrees to this policy. A separate consent step, with a check that you are the parent or guardian, comes before May 2027.",
    );
    expect(kheelu).toContain("In AI mode, Kheelu uses your home Wi‑Fi and sends your child’s voice to Kheelona’s servers.");
    expect(kheelu).toContain("Every company that runs Kheelu and the parent app for us is named below, under Everyone who handles your data. Some of them process data outside India.");
    expect(kheelu).not.toMatch(/on request|which providers we use|servers in India/);
  });

  /* D058 item 6 (task 8b.1) supersedes item 16: the processors named, as the live /privacy names them, some outside India. */
  it("lists every recipient with its region (D058 item 6; D055 item 24): the processors named in one row, some outside India", () => {
    const recipients = part("who-else").blocks.find((b) => b.kind === "recipients");
    const rows = recipients?.kind === "recipients" ? recipients.rows : [];
    expect(rows.map((r) => [toPlainText(r.who), toPlainText(r.where)])).toEqual([
      ["Google Cloud, Google’s Gemini, Sarvam AI, Twilio, Aiven, Redis, New Relic and Sentry", "India, and some of them outside India"],
      ["Razorpay", "India"],
      ["Supabase", "Australia"],
      ["Resend", "United States"],
      ["Vercel", "India (Mumbai) for the store’s server code"],
      ["Google", "Google data centres around the world"],
      ["Meta", "The United States and other countries"],
      ["PostHog", "United States"],
      ["Ahrefs", "United States"],
    ]);
  });

  /* D058 item 1 (task 8b.1) supersedes item 18: deleting the account deletes the data (the live /privacy, map §1 P12). */
  it("keeps things as the founder said (items 13 and 19-21; D058 items 1 and 9): recordings by the 36 months, a deleted account deleted, orders without a period", () => {
    const keep = partText("keep");
    expect(keep).toContain(`Conversation transcripts:\n${RETENTION_MONTHS} months, then deleted automatically, unless you delete your account sooner.`);
    expect(keep).toContain(`Voice recordings:\n${RETENTION_MONTHS} months, the same as transcripts. With Save voice recordings off, we keep the text only.`);
    expect(keep).toContain("If you delete your parent-app account:\nwe delete the account, your child’s profile, and their conversations and recordings.");
    expect(keep).not.toMatch(/until their \d+ months end|keep none/);
    expect(keep).toContain("Orders you’ve paid for:\nas long as Indian tax law requires, even after a refund.");
    expect(keep).toContain("Unpaid orders:\nwe keep them until you ask us to delete them.");
    expect(keep).toContain("PostHog:\nscreen recordings for 30 days.");
    expect(partText("store")).toContain("If you start a pre-order and don’t pay, the details you entered are still saved, as an unpaid order. We keep them until you ask us to delete them.");
  });

  /* D058 item 1 (task 8b.1; the live /privacy, map §1 P10-P12): removing a chat hides it on that phone, and item 17's limit
     stays said plainly; deleting the account deletes. G26 (D065 item 7; task Q2.14): "Delete all chats" in the app deletes
     the chats from our servers, so the settings list gains it and the way to delete a child's conversations names it.
     Nothing else changes: what removing one chat does, and whether "Delete all chats" reaches Kheelu's memory or the
     training data, is not on file (G33). */
  it("says what the app's privacy settings do, what removing a chat does not reach (item 17; D058), and promises nothing about backups", () => {
    const rights = partText("rights");
    expect(rights).toContain("In the app’s privacy settings, you can:");
    const list = part("rights").blocks.find((b) => b.kind === "list");
    expect(list?.kind === "list" && list.items).toEqual([
      "turn off Save voice recordings, to keep the text of conversations only;",
      "download your child’s data;",
      "delete all chats, which deletes them from our servers;",
      "delete your account.",
    ]);
    expect(rights).toContain(
      "Removing a chat in the parent app hides it on that phone only. It is not removed from our servers, from Kheelu’s memory, or from the data our model trains on. To delete your child’s conversations, use “Delete all chats” in the app, delete your account, or write to us.",
    );
    expect(rights).toContain("Deleting your account deletes the account, your child’s profile, and their conversations and voice recordings.");
    expect(rights).not.toMatch(/one tap|backups/);
  });

  it("keeps the confirmed security lines and the founder's breach sentence (items 22 and 23)", () => {
    const paragraphs = part("security").blocks.map((b) => (b.kind === "p" && b.text !== undefined ? toPlainText(b.text) : b.kind));
    expect(paragraphs).toEqual([
      "Payments happen on Razorpay’s own form, so card, UPI and bank details never reach us. Only our team can read your order.",
      "If your data is ever exposed, we tell you without delay, and the Data Protection Board as the law requires.",
    ]);
  });

  it("leads the list of what blocking can't stop without counting (D054 item 12, P14)", () => {
    expect(partText("choices")).toContain("What blocking can’t stop.");
    expect(partText("choices")).not.toContain("Two things");
  });
});
