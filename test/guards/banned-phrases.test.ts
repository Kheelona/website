import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICLE_SLUGS } from "@/content/en-IN/routes";
import { ARTICLE_CLAIM_FIXES, CLAIM_FIXES, editsBeforeClaimFixes } from "../e2e/support/deviations";
import type { PageFacts } from "../e2e/support/page-facts";
import { ROOT, isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";
import { approvedMockupText, htmlToText, MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { codeWithoutComments, parseSource, sourceStrings } from "../e2e/support/source";
import { mockupFold, parseMockup } from "../support/mockup-compare";
import { blockSentences, withFacts } from "../support/mockup-facts";
import { BANNED_PHRASES, CLAIM_FIXED_MOCKUPS, type ClaimFixedMockup, findBanned, findBannedOnMockup } from "./banned-phrases.data";
import { isStillLegacy } from "./legacy-paths";

/* banned-phrases (task 1.1; architecture §14, claims §4, QA review N24).
 *
 * Checks, every run:
 *   1. the data is in sync with wiki/product/claims.md §4: every BANNED row has an entry;
 *   2. every entry is red on its planted example;
 *   3. every entry is green on all 18 approved mockup pages (visible text, title and description)
 *      and on every copy block (quoted lines) of wiki/site/pages/*.md, so the guard can never
 *      contradict approved copy. One exception, on the mockups alone (task 8b.1b): a claim D058
 *      withdrew after Gate A may still be printed by a frozen mockup whose route carries a claim-fix
 *      rule, where the entry names that page (`mockupExempt`); 3b proves every such exemption backed
 *      by the page's rule and needed;
 *   4. no string in src/content/** carries a banned phrase (rendered text: content-integrity.spec.ts);
 *   5. no shipped src/**\/*.ts(x) file carries a retired offer term, comments aside (the full scope
 *      of test/preorder-copy.test.ts, machine routes named);
 *   6. no shipped src file that is not still legacy carries a banned claim (pending items printed);
 *   7. the README's front door carries no retired offer term (kept from test/preorder-copy.test.ts).
 */

function claimsTableFirstCells(heading: string, until: string): { first: string; site: string }[] {
  const md = readRepoFile("wiki/product/claims.md");
  const start = md.indexOf(heading);
  const end = md.indexOf(until, start + heading.length);
  expect(start, `claims.md has no "${heading}" section`).toBeGreaterThan(0);
  return md
    .slice(start, end)
    .split("\n")
    .filter((l) => l.startsWith("| ") && !/^\|\s*(Wording|Claim)\s*\|/.test(l))
    .map((l) => {
      const cells = l.split(" | ");
      return { first: cells[0].replace(/^\|\s*/, "").trim(), site: cells[cells.length - 1].replace(/\s*\|\s*$/, "") };
    });
}

describe("banned-phrases data stays in sync with claims §4", () => {
  const section4 = claimsTableFirstCells("## 4. Retired or banned wording", "### 4.1");
  const section3 = claimsTableFirstCells("## 3. Not confirmed: do not publish", "### 3.1");

  it("reads the real §4 table", () => {
    expect(section4.length).toBeGreaterThanOrEqual(20);
  });

  it("has an entry for every banned row of §4", () => {
    const missing = section4
      .filter((r) => /BANNED/.test(r.site))
      .filter((r) => !BANNED_PHRASES.some((e) => r.first.startsWith(e.claimsRow)))
      .map((r) => r.first.slice(0, 80));
    expect(missing, `claims §4 rows with no banned-phrases entry:\n${missing.join("\n")}`).toEqual([]);
  });

  it("cites a real claims row in every entry", () => {
    const orphans = BANNED_PHRASES.filter((e) => e.kind !== "spelling").filter((e) =>
      e.claimsRow.startsWith("§3: ")
        ? !section3.some((r) => r.first.startsWith(e.claimsRow.slice(4)))
        : !section4.some((r) => r.first.startsWith(e.claimsRow)),
    );
    expect(orphans.map((e) => `${e.id}: ${e.claimsRow}`)).toEqual([]);
  });

  it("uses unique ids", () => {
    const ids = BANNED_PHRASES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("every entry is red on its planted example", () => {
  it.each(BANNED_PHRASES.map((e) => [e.id, e] as const))("%s", (_id, entry) => {
    expect(findBanned(entry.planted).map((h) => h.id)).toContain(entry.id);
  });
});

describe("every entry is green on approved copy", () => {
  it.each(MOCKUP_SLUGS)("mockup %s", (slug) => {
    const hits = findBannedOnMockup(slug, approvedMockupText(slug));
    expect(hits, hits.map((h) => `${h.id}: "${h.match}" in "${h.sentence}"`).join("\n")).toEqual([]);
  });

  const pages = readdirSync(join(ROOT, "wiki/site/pages")).filter((f) => f.endsWith(".md"));
  /* The 15 site pages by name, and one copy page per article of the URL plan (tasks 5.6, 5.17-5.19), so a new or
   * missing copy page is named rather than counted (ruling at the wave 5 part C merge). */
  const SITE_PAGES = ["404", "ai-toys-for-kids-in-india", "contact", "home", "meet-kheelu", "privacy", "refund", "safety", "setup", "shipping", "store", "store-confirmation", "stories", "team", "terms"];
  it("covers the 15 site pages and the 20 article copy pages (D053 took the 3-6-9-12 guide's off)", () => {
    expect(pages.filter((f) => !f.startsWith("story-")).sort()).toEqual(SITE_PAGES.map((s) => `${s}.md`).sort());
    expect(pages.filter((f) => f.startsWith("story-")).sort()).toEqual(ARTICLE_SLUGS.map((s) => `story-${s}.md`).sort());
  });
  it.each(pages)("copy blocks of %s", (file) => {
    const quoted = readRepoFile(`wiki/site/pages/${file}`)
      .split("\n")
      .filter((l) => /^\s*>/.test(l))
      .map((l) => l.replace(/^\s*>\s?/, ""))
      .join("\n");
    const hits = findBanned(quoted);
    expect(hits, hits.map((h) => `${h.id}: "${h.match}" in "${h.sentence}"`).join("\n")).toEqual([]);
  });
});

/* 3b. The withdrawn claims a frozen mockup may still print (task 8b.1b; D058, D046). An entry's `mockupExempt` names the
 * claim-fixed pages that print it and the deviation rows of their rules; the exemption is the approved-mockup check's
 * alone (findBannedOnMockup), never the copy pages', src/'s or the rendered build's. Each exemption must be backed: its
 * page's route carries a claim-fix rule (test/e2e/support/deviations.ts CLAIM_FIXES, V26-V34; ARTICLE_CLAIM_FIXES, V37),
 * the page prints the claim only inside <main>, and the page's rules (its earlier rules, then its claim fixes) leave
 * <main> green, so the build prints none of it. And each must be needed: without the field rule 3 is red on exactly the
 * exempted pages and entries. */
describe("rule 3's exemption: the withdrawn claims the frozen mockups still print (D058; task 8b.1b)", () => {
  const RULES: Readonly<Record<ClaimFixedMockup, PageFacts>> = { ...CLAIM_FIXES, ...ARTICLE_CLAIM_FIXES };
  const exempted = BANNED_PHRASES.flatMap((entry) => (entry.mockupExempt?.on ?? []).map((slug) => ({ entry, slug })));
  const rowOf = (slug: ClaimFixedMockup) => /\bV\d+\b/.exec(RULES[slug].approvedBy)?.[0];
  const textOf = (el: Element) => blockSentences(el).join("\n");
  const shown = (hits: readonly { id: string; match: string; sentence: string }[]) => hits.map((h) => `${h.id}: "${h.match}" in "${h.sentence}"`).join("\n");

  it("names exactly the mockups whose routes carry a claim-fix rule, each an approved page", () => {
    expect([...CLAIM_FIXED_MOCKUPS].sort()).toEqual([...Object.keys(CLAIM_FIXES), ...Object.keys(ARTICLE_CLAIM_FIXES)].sort());
    for (const slug of CLAIM_FIXED_MOCKUPS) expect(MOCKUP_SLUGS).toContain(slug);
  });

  it("is a claim entry's only, names each page once, and cites each page's deviation row", () => {
    expect(exempted.length).toBeGreaterThan(0);
    for (const entry of BANNED_PHRASES.filter((e) => e.mockupExempt)) {
      const { on, because } = entry.mockupExempt!;
      expect(entry.kind, entry.id).toBe("claim");
      expect(on.length, entry.id).toBeGreaterThan(0);
      expect(new Set(on).size, `${entry.id} names a page twice`).toBe(on.length);
      for (const slug of on) {
        expect(rowOf(slug), `${slug}'s rule names no deviation row`).toBeDefined();
        expect(because, `${entry.id}: "because" must cite ${slug}'s row`).toMatch(new RegExp(`\\b${rowOf(slug)}\\b`));
      }
    }
  });

  it("is needed wherever it applies: without the field rule 3 is red on exactly the exempted pages and entries", () => {
    const red = MOCKUP_SLUGS.flatMap((slug) => [...new Set(findBanned(approvedMockupText(slug)).map((h) => `${h.id} on ${slug}`))]);
    expect(red.sort()).toEqual(exempted.map(({ entry, slug }) => `${entry.id} on ${slug}`).sort());
  });

  it.each(CLAIM_FIXED_MOCKUPS)("%s: prints the exempted claims only inside <main>, and the page's rules withdraw every one", (slug) => {
    const ids = exempted.filter((x) => x.slug === slug).map((x) => x.entry.id);
    const page = parseMockup(slug);
    page.querySelector("main")!.remove();
    const description = page.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const outside = findBanned([page.title, description, htmlToText(page.documentElement.outerHTML)].join("\n")).filter((h) => ids.includes(h.id));
    expect(outside, shown(outside)).toEqual([]);
    const main = mockupFold(slug, "main");
    expect([...new Set(findBanned(textOf(main)).map((h) => h.id))].sort()).toEqual([...ids].sort());
    /* As parity-deviations.test.ts applies them: the page's earlier rules, then its claim fixes on that page. */
    const built = findBanned(textOf(withFacts(withFacts(main, editsBeforeClaimFixes(slug)), RULES[slug].edits)));
    expect(built, shown(built)).toEqual([]);
  });

  it("exempts nothing anywhere else: each exempted entry stays red on a mockup it does not name and in findBanned", () => {
    for (const entry of BANNED_PHRASES.filter((e) => e.mockupExempt)) {
      const elsewhere = MOCKUP_SLUGS.find((slug) => !(entry.mockupExempt!.on as readonly string[]).includes(slug))!;
      expect(findBannedOnMockup(elsewhere, entry.planted).map((h) => h.id), `${entry.id} on ${elsewhere}`).toContain(entry.id);
      expect(findBannedOnMockup(entry.mockupExempt!.on[0], entry.planted).map((h) => h.id), entry.id).not.toContain(entry.id);
      expect(findBanned(entry.planted).map((h) => h.id), entry.id).toContain(entry.id);
    }
  });
});

/* The D058 entries ban the idea in whole words (lessons §7): other phrasings of each withdrawn claim are red, and the
 * approved lines nearest to one (the parents' advice task 8b.1b keeps, the code-checked words) stay green. Task 8b.1d
 * (8b.1b's review): the entries whose idea is a product's feature are tied to the product (Kheelu, the app, "it" as the
 * toy) or kept in their noun form, so a parent's own habit passes; and the plain rewordings the review found are red. */
describe("the D058 entries: the idea, not one phrasing (tasks 8b.1b, 8b.1d)", () => {
  const VARIANTS: readonly (readonly [string, string])[] = [
    ["one-tap-delete", "One-tap deletion for every chat."],
    ["one-tap-delete", "Remove any conversation with a single tap."],
    ["servers-in-india", "Your child’s voice goes to Indian servers."],
    ["servers-in-india", "Everything is stored in India."],
    /* A buyer's-guide question that sets the bar D058 withdrew stays refused (task 8b.1b item 3). */
    ["servers-in-india", "Ask whether its servers are in India."],
    ["servers-in-india", "Your data stays in India."],
    ["servers-in-india", "Data is stored on Indian soil."],
    ["closed-library", "Replies come from a closed set of answers."],
    ["safety-layer", "Each answer Kheelu gives passes our checks for your child’s age."],
    ["quiet-hours", "Set quiet hours in the parent app."],
    ["topic-controls", "Choose which topics Kheelu talks about."],
    ["topic-controls", "In the parent app, you decide what topics are allowed."],
    ["new-word-count", "The app counts how many new words your child uses."],
    ["new-word-count", "Kheelu tracks your child’s new words each week."],
    ["new-word-count", "It counts every new word your child says."],
    /* The product named after the feature, too (8b.1d review item 1): the entries tie the product either side. */
    ["new-word-count", "Track your child’s new words in the app."],
    ["new-word-count", "Count your child’s new words in the parent app."],
    ["new-word-count", "Track your child’s new words with Kheelu."],
    ["four-skills-report", "Kheelu sends you a weekly progress report."],
    ["minute-of-quiet", "It turns off after one minute."],
    ["minute-of-quiet", "It goes quiet after 60 seconds."],
    ["minute-of-quiet", "After about a minute of quiet, it switches itself off."],
    ["minute-of-quiet", "Microphone: off after about a minute of quiet."],
    ["minute-of-quiet", "One minute of quiet and Kheelu stops listening."],
    ["minute-of-quiet", "A minute of silence and Kheelu turns itself off."],
    ["minute-of-quiet", "The wake-up button: a minute of quiet and the microphone is off."],
    ["minute-of-quiet", "It sleeps after a minute of quiet."],
    ["minute-of-quiet", "It goes to sleep after a minute of quiet."],
    ["minute-of-quiet", "A minute of quiet and it switches off."],
    ["minute-of-quiet", "One minute of quiet, and it stops."],
    ["attack-own-safety", "We red-team our own model before launch."],
    ["attack-own-safety", "We try to break our own safety filters before every release."],
    ["keep-none-of-it", "The providers keep nothing."],
    ["keep-none-of-it", "The providers retain nothing."],
  ];
  /* Approved lines, word for word: the guides' advice (should-kids, the AI-tutor checklist, the late-talker tips, the
   * buyer's guide), the code-checked words of task 8b.1 and /privacy's processors row; and the parents' advice a
   * dashboard post may give (task 8b.1d), which no product feature is claimed in. */
  const NEAR_MISSES = [
    "Keep a notebook and track your child’s new words each week.",
    "Sit together for a minute of quiet before bed.",
    "Let your child choose which topics to talk about at bedtime.",
    /* Parents' lines the D058 entries once refused through a loose subject, place or verb (8b.1d review item 2). */
    "If your family stays in India for the holidays, pack the charger.",
    "Grandma stays in India while we live abroad.",
    "Kids are honest: they hold nothing back.",
    "Ask Kheelu about anything: your child picks the topic.",
    "If your child says “ba” for ball every time, it counts as a new word.",
    "Track your child’s new words in a notebook or a notes app.",
    "If they don’t answer, ask it again after a minute of quiet.",
    "Try a minute of quiet, and it goes better than a lecture.",
    "Can it reach the open internet?",
    "It can’t browse the open internet.",
    "Is every reply checked for your child’s age, and can the maker say how?",
    "Can you read every conversation, and how do you delete it?",
    "Ask whether you can read every conversation, word for word, and how you delete it, without emailing anyone.",
    "Explain a new word in the same breath: “The dal is boiling. See the bubbles?”",
    "Getting your child talking, late talkers, new words and two languages at home.",
    "It stays on while your child talks and switches itself off after a couple of minutes of quiet.",
    "They don’t keep it, and they never use it to train their AI.",
    "Removing a chat in the app hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
    "The AI model that answers your child gets child-safety rules for that age, with Google’s safety filters on top.",
    "Each conversation appears a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month.",
    "India, and some of them outside India",
  ];

  it.each(VARIANTS)("%s is red on “%s”", (id, line) => {
    expect(findBanned(line, ["claim"]).map((h) => h.id)).toContain(id);
  });

  it.each(NEAR_MISSES)("passes “%s”", (line) => {
    expect(findBanned(line)).toEqual([]);
  });
});

/* The advisor's stale facts (D061, 2026-10-15; task 8c.4). A senior marketing advisor's homepage proposal (12 October
 * 2026; wiki/raw/feedback/advisor-homepage-2026-10-12/, local and git-ignored) carried facts that are no longer true, or
 * never were: cash on delivery (D024), "Ships 20 Oct" (D023), open-ended ages (D009), ₹499 in the button label (D028,
 * D041 G1), "Real pilot homes" (D057 item 2), "Backed by" over the programmes (B26) and "Safety certified" (claims §6).
 * One entry per idea, each a row of claims.md §4's D061 table. VARIANTS holds the advisor's own lines (quoted from the
 * document, which this repo does not carry) and other phrasings of each idea; NEAR_MISSES the approved lines nearest to
 * one, word for word, and a parent's lines that share its words without the claim. */
describe("the D061 entries: the advisor's stale facts, the idea not one phrasing (task 8c.4)", () => {
  const D061 = ["cash-on-delivery", "ships-20-october", "open-ended-ages", "part-price-button", "pilot-homes", "backed-by", "safety-certified"];

  it("reads the seven D061 entries from claims.md §4, each a row of its own", () => {
    const md = readRepoFile("wiki/product/claims.md");
    const table = md.slice(md.indexOf("**The advisor's stale facts (D061"), md.indexOf("### 4.1"));
    const rows = table
      .split("\n")
      .filter((l) => l.startsWith("| ") && /\| BANNED 2026-10-15 \(D061\)/.test(l))
      .map((l) => l.split(" | ")[0].replace(/^\|\s*/, ""));
    expect(rows).toHaveLength(D061.length);
    expect(BANNED_PHRASES.filter((e) => rows.some((r) => r.startsWith(e.claimsRow))).map((e) => e.id)).toEqual(D061);
  });

  const VARIANTS: readonly (readonly [string, string])[] = [
    /* Cash on delivery offered (D024: every order is paid online; the checkout is frozen, ADR-013). */
    ["cash-on-delivery", "Founding price ₹4,999 for the first 500 • Ships 20 Oct • Cash on delivery • 15-day returns"],
    ["cash-on-delivery", "Or cash on delivery"],
    ["cash-on-delivery", "Pay ₹499 now and ₹4,500 at dispatch, or pay cash on delivery."],
    ["cash-on-delivery", "Pay today / Pay on delivery (updates with choice)"],
    ["cash-on-delivery", "Button: Pay ₹499 and reserve / Place cash-on-delivery order"],
    ["cash-on-delivery", "Cash on delivery (pay ₹4,999 when Kheelu arrives at your door)"],
    ["cash-on-delivery", "Is the ₹499 reservation kept alongside COD"],
    ["cash-on-delivery", "COD available on every order."],
    ["cash-on-delivery", "Pay when it arrives."],
    ["cash-on-delivery", "Pay the balance in cash at the door."],
    /* "Ships 20 Oct" (D023: new orders deliver from mid-November). */
    ["ships-20-october", "Ships 20 Oct"],
    ["ships-20-october", "Ships 20 October 2026"],
    ["ships-20-october", "Only 500 at the founding price. Ships 20 October."],
    ["ships-20-october", "Shipping from October 20th."],
    ["ships-20-october", "Dispatch starts on 20 Oct."],
    ["ships-20-october", "Delivered to your door by 20 October."],
    ["ships-20-october", "Arrives 20/10/2026."],
    /* Open-ended ages (D009: 3 to 7). */
    ["open-ended-ages", "Ages 3+"],
    ["open-ended-ages", "SCREEN-FREE · AGES 3+"],
    ["open-ended-ages", "Badge: NEW · Screen-free AI toy · Ages 3+"],
    ["open-ended-ages", "AI books: Stories that answer back. (Ages 5+, coming soon)"],
    ["open-ended-ages", "6+"],
    ["open-ended-ages", "Tap an age circle: 3, 4, 5, 6+"],
    ["open-ended-ages", "A soft, screen-free AI toy for children aged 3 and up."],
    ["open-ended-ages", "Ages 3 and up. It grows with your child."],
    ["open-ended-ages", "For 3 years and above."],
    ["open-ended-ages", "Suitable from 3 years onwards."],
    ["open-ended-ages", "Made for 3+ year olds."],
    ["open-ended-ages", "For kids aged three and older."],
    /* A part-price in the pre-order button (D028, D041 G1: "Pre-order Kheelu"; DARK-03). */
    ["part-price-button", "Pre-order for ₹499"],
    ["part-price-button", "Button: Pre-order ₹499"],
    ["part-price-button", "Sticky bar: Pre-order for ₹499 | WhatsApp icon"],
    ["part-price-button", "PRE-ORDER FOR ₹499"],
    ["part-price-button", "Pre-order for {price:token}"],
    ["part-price-button", "Pre-order now at ₹499"],
    ["part-price-button", "Preorder @ Rs 499"],
    ["part-price-button", "Book now for ₹499"],
    ["part-price-button", "Pre-order Kheelu for ₹4,500"],
    /* "Real pilot homes" (D057 item 2: not every film was shot at home). */
    ["pilot-homes", "Real pilot homes"],
    ["pilot-homes", "REAL PILOT HOMES"],
    ["pilot-homes", "Filmed in our pilot homes."],
    /* "Backed by" over the programmes (B26: names only, no relationship). */
    ["backed-by", "Backed by top programs"],
    ["backed-by", "Backed by"],
    ["backed-by", "Backed by NVIDIA Inception, Karnataka Elevate and nasscom."],
    ["backed-by", "An NVIDIA-backed startup."],
    ["backed-by", "Supported by NVIDIA Inception and nasscom startups."],
    ["backed-by", "Funded by Karnataka Elevate."],
    /* "Safety certified" (claims §6: BIS applied for, not granted). */
    ["safety-certified", "Safety certified"],
    ["safety-certified", "[Safety certified · confirm]"],
    ["safety-certified", "A safety-certified plush toy."],
    ["safety-certified", "Certified safe for children."],
    ["safety-certified", "Kheelu is BIS certified."],
    ["safety-certified", "Certified for child safety."],
  ];

  /* Approved lines, word for word (shipping, terms, the FAQ answers, the price sentence, the store's pay button, the films'
   * consent lines, /team's strip, /safety's certification fold, the product page's Safety tab and the founders' bios), the
   * share text of task 8c.2, and a parent's lines that share an entry's words without its claim. */
  const NEAR_MISSES = [
    "Every order is paid online, so there’s no cash on delivery.",
    "Delivery is in the price. Nothing to pay at the door.",
    "Delivery is included anywhere in India, with nothing to pay at the door.",
    "Delivery anywhere in India is included, so the price is the whole cost of Kheelu arriving at your door. Nothing is collected at the door.",
    "We don’t offer cash on delivery.",
    "Cash on delivery isn’t available.",
    "Can I pay cash on delivery?",
    "Deliveries start mid-November.",
    "Last updated: 14 October 2026",
    "Ships from",
    "Kheelu is made for children aged 3 to 7.",
    "Screen time for a 3-year-old, and up to age 7",
    "In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.",
    "Children should be taught in their home language until at least Grade 5, and preferably till Grade 8 and beyond.",
    "Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app.",
    "WhatsApp or call +91 91875 46483",
    "Aim for 2+ hours of outdoor play on a holiday.",
    'export const KHEELU_AGES = "3+";',
    "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    "Pay ₹499 and reserve",
    "Pre-order Kheelu",
    "Kheelu is ₹4,999 (incl. GST); pre-order with {price:token} today, refundable until dispatch.",
    "A refundable {price:token} advance reserves yours today, and the remaining {price:balance} is due before delivery.",
    "Our films are different: they show real pilot families, filmed with their permission.",
    "The films on this website show pilot families, filmed with their permission.",
    "Real children in real homes. Press play on any of them.",
    "Recognised by.",
    "NVIDIA Inception Program",
    "It is advice backed by research, not a rule.",
    "Toy-safety certification (BIS): applied for, not yet granted. We show no mark until it is granted.",
    "We have applied for Kheelu’s BIS licence for toy safety. It has not been granted yet, so no toy-safety certificate has been issued to us so far.",
    "“Trusted” means we chose them carefully; it is not a certification.",
    "Over a decade in hardware, including years at Intel leading Thunderbolt 4 and 5 compliance, he took products from a blank page to certification.",
    "Kheelu is not yet safety certified.",
  ];

  it.each(VARIANTS)("%s is red on “%s”", (id, line) => {
    expect(findBanned(line).map((h) => h.id)).toContain(id);
  });

  it.each(NEAR_MISSES)("passes “%s”", (line) => {
    expect(findBanned(line)).toEqual([]);
  });

  it("names every D061 idea in VARIANTS, and each entry's planted line is the advisor's own words", () => {
    expect([...new Set(VARIANTS.map(([id]) => id))].sort()).toEqual([...D061].sort());
    const planted = Object.fromEntries(BANNED_PHRASES.filter((e) => D061.includes(e.id)).map((e) => [e.id, e.planted]));
    expect(planted).toEqual({
      "cash-on-delivery": "Cash on delivery",
      "ships-20-october": "Ships 20 Oct",
      "open-ended-ages": "Ages 3+",
      "part-price-button": "Pre-order for ₹499",
      "pilot-homes": "Real pilot homes",
      "backed-by": "Backed by top programs",
      "safety-certified": "Safety certified",
    });
  });
});

describe("src/content carries no banned phrase", () => {
  it("checks every string of every content module", () => {
    const files = listFiles(["src/content"]).filter((p) => /\.(ts|tsx)$/.test(p) && !/\.test\.tsx?$/.test(p));
    const problems: string[] = [];
    for (const path of files) {
      for (const s of sourceStrings(parseSource(path, readRepoFile(path)))) {
        for (const h of findBanned(s.text)) problems.push(`${path}:${s.line} ${h.id}: "${h.match}" in "${h.sentence}"`);
      }
    }
    console.log(`[banned-phrases] ${BANNED_PHRASES.length} entries; scanned ${files.length} content module(s).`);
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

/* 4b. The stories print no claim D058 withdrew (task 8b.1d). Storybook is where a section is reviewed apart from its page,
 * and its data once kept the frozen mockups' Gate A words while their parity tests held it to them; those tests now apply
 * the route's claim fixes to the mockup first (CLAIM_FIXES, ARTICLE_CLAIM_FIXES), so the data takes the site's words.
 * Every string of every story file (strings, templates and JSX text) runs through the D058 entries, the ones citing a
 * row of claims.md §4's D058 table; data a story reads from content is the content scan's (rule 4). */
describe("the stories print no claim D058 withdrew (task 8b.1d)", () => {
  const md = readRepoFile("wiki/product/claims.md");
  const table = md.slice(md.indexOf("**Withdrawn by the live team's code check (D058"), md.indexOf("### 4.1"));
  const rows = table
    .split("\n")
    .filter((l) => l.startsWith("| ") && /\| WITHDRAWN 2026-10-14/.test(l))
    .map((l) => l.split(" | ")[0].replace(/^\|\s*/, ""));
  const D058 = BANNED_PHRASES.filter((e) => e.kind === "claim" && rows.some((r) => r.startsWith(e.claimsRow)));
  const stories = listFiles(["src"]).filter((p) => /\.stories\.tsx?$/.test(p));

  it("reads the eleven D058 entries from claims.md §4 and a real story list", () => {
    expect(D058.map((e) => e.id)).toEqual([
      "one-tap-delete",
      "servers-in-india",
      "closed-library",
      "safety-layer",
      "quiet-hours",
      "topic-controls",
      "new-word-count",
      "four-skills-report",
      "minute-of-quiet",
      "attack-own-safety",
      "keep-none-of-it",
    ]);
    expect(stories.length).toBeGreaterThan(50);
    expect(stories).toContain("src/components/sections/ProductDetails/ProductDetails.stories.tsx");
  });

  it("finds none in any story file's strings", () => {
    const problems: string[] = [];
    for (const path of stories) {
      for (const s of sourceStrings(parseSource(path, readRepoFile(path)))) {
        for (const h of findBanned(s.text, ["claim"]).filter((hit) => D058.some((e) => e.id === hit.id))) {
          problems.push(`${path}:${s.line} ${h.id}: "${h.match}" in "${h.sentence}"`);
        }
      }
    }
    console.log(`[banned-phrases] D058 claims: scanned ${stories.length} story file(s).`);
    expect(problems, `withdrawn claims in the stories (D058; claims §4):\n${problems.join("\n")}`).toEqual([]);
  });
});

describe("src/ publishes no retired offer term (ported from test/preorder-copy.test.ts)", () => {
  /* The old test scanned every shipped .ts/.tsx file under src/, comments stripped, and named the
     two machine routes on purpose: llms.txt and pricing.md are exactly where a retired promise
     ("No payment now", "₹9,999", "the pre-order list") would come back unnoticed and be quoted by
     answer engines. That coverage is kept whole here, over config, lib, components and app alike;
     content-integrity.spec.ts adds the rendered text of every new route. The en-IN spelling entries
     stay out of code (N24): "center" and "color" are CSS words there, not copy. */
  const files = listFiles(["src"]).filter((p) => /\.(ts|tsx)$/.test(p) && !isTestOrStory(p));

  it("drops comments but keeps every literal verbatim (the scan's own calibration)", () => {
    const sample = [
      `// "No payment now" may be explained in a comment`,
      `/* ₹9,999 was the after-price */`,
      `export const PAISE = 999_900;`,
      `export const P = () => <p>Reserve a spot. <strong>It is free</strong>{/* Tally */}</p>;`,
    ].join("\n");
    const ids = findBanned(codeWithoutComments(parseSource("src/x.tsx", sample)), ["offer"]).map((h) => h.id);
    expect(ids.sort()).toEqual(["offer-9999", "offer-reserving-free"]);
  });

  it("scans a real file list", () => {
    expect(files.length).toBeGreaterThan(60);
    expect(files).toContain("src/app/llms.txt/route.ts");
    expect(files).toContain("src/app/pricing.md/route.ts");
  });

  it("finds no retired offer term in any shipped src file, comments aside", () => {
    const problems: string[] = [];
    for (const path of files) {
      const code = codeWithoutComments(parseSource(path, readRepoFile(path)));
      for (const h of findBanned(code, ["offer"])) problems.push(`${path} ${h.id}: "${h.match}" in "${h.sentence}"`);
    }
    console.log(`[banned-phrases] retired offer terms: scanned ${files.length} shipped src file(s).`);
    expect(problems, `retired offer terms in src/ (claims §4 row 18):\n${problems.join("\n")}`).toEqual([]);
  });
});

type PendingItem = { path: string; id: string; match: string; count: number; why: string };
type ClaimHit = { path: string; id: string; match: string; text: string };

/** A pending item absorbs at most `count` hits of its own phrase (same path, id and matched
 *  text); every other hit, a further copy of the same phrase included, is a problem. `seen[i]`
 *  is how many hits item i absorbed: 0 means its owner has rewritten the line (resolved). */
function classifyClaimHits(hits: readonly ClaimHit[], pending: readonly PendingItem[]): { problems: string[]; seen: number[] } {
  const seen = pending.map(() => 0);
  const problems: string[] = [];
  for (const h of hits) {
    const i = pending.findIndex((p) => p.path === h.path && p.id === h.id && p.match === h.match);
    if (i >= 0 && seen[i] < pending[i].count) seen[i]++;
    else problems.push(h.text);
  }
  return { problems, seen };
}

describe("pending items absorb only their own count of hits", () => {
  const item = { path: "src/config/site.ts", id: "lessons", match: "lessons", count: 1, why: "" };
  const hit = (path = item.path, match = item.match) => ({ path, id: item.id, match, text: `${path} lessons: "${match}"` });

  it("absorbs the one pending hit", () => {
    expect(classifyClaimHits([hit()], [item])).toEqual({ problems: [], seen: [1] });
  });

  it("fails a second hit of the same phrase in the same file", () => {
    expect(classifyClaimHits([hit(), hit()], [item]).problems).toEqual([hit().text]);
  });

  it("fails the same phrase in another file", () => {
    expect(classifyClaimHits([hit("src/config/other.ts")], [item]).problems).toEqual([hit("src/config/other.ts").text]);
  });

  it("reports an item with no hit left as resolved (seen 0)", () => {
    expect(classifyClaimHits([], [item])).toEqual({ problems: [], seen: [0] });
  });
});

describe("new src/ code carries no banned claim", () => {
  /* The claim entries over every shipped src file that is not still legacy (legacy-paths.ts): new
     code, and any legacy file the moment a task rewrites it. Pending items are hits that predate
     the reset in files no wave-1 task owns; each is printed on every run, never silent, and stops
     printing once its owner rewrites the line. A pending item never hides a new hit: it absorbs
     exactly `count` hits of its phrase in its file, and one more fails. */
  /* Empty since task 6.3 (merged 2026-10-14): its one item, KHEELONA_PLUS_LINE's "lessons" in src/config/site.ts, went
     with the constant, so a reintroduction of the retired line fails here (6.3 review minor 1). */
  const PENDING: readonly PendingItem[] = [];

  it("finds no banned claim outside the named pending items", () => {
    const files = listFiles(["src"]).filter((p) => /\.(ts|tsx)$/.test(p) && !isTestOrStory(p) && !isStillLegacy(p));
    const hits: ClaimHit[] = [];
    for (const path of files) {
      for (const h of findBanned(codeWithoutComments(parseSource(path, readRepoFile(path))), ["claim"])) {
        hits.push({ path, id: h.id, match: h.match, text: `${path} ${h.id}: "${h.match}" in "${h.sentence}"` });
      }
    }
    const { problems, seen } = classifyClaimHits(hits, PENDING);
    const pendingLines = PENDING.map(
      (p, i) => `  ${seen[i] ? `PENDING (${seen[i]} of ${p.count})` : "resolved"} ${p.path} ${p.id}: ${p.why}`,
    );
    console.log(`[banned-phrases] claims: scanned ${files.length} new src file(s).\n${pendingLines.join("\n")}`);
    expect(problems, `banned claims in new src/ code (claims §4):\n${problems.join("\n")}`).toEqual([]);
  });
});

describe("the README's front door", () => {
  /* Kept from test/preorder-copy.test.ts (2026-08-23): the README's opening sentence described
     the offer as "no payment now" for a day after the store went live. Only the front door is
     checked; the dated history further down legitimately says what shipped in July. */
  it("carries no retired offer term", () => {
    const readme = readRepoFile("README.md");
    const cut = readme.indexOf("### Step 1");
    expect(cut, "the README's resume protocol moved; re-point this scan").toBeGreaterThan(0);
    const hits = findBanned(readme.slice(0, cut), ["offer"]);
    expect(hits.map((h) => `${h.id}: "${h.match}"`)).toEqual([]);
  });
});
