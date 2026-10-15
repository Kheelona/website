import { findBanned, findBannedOnMockup } from "../guards/banned-phrases.data";
import { expect, gateRouteGroup, nodeGet, requiresServer, test } from "./support/fixtures";
import { PARITY_TARGET } from "./support/env";
import { MOCKUP_SLUGS, approvedMockupText, type MockupSlug } from "./support/mockup-text";
import { jsonLdMismatches } from "./support/page-checks";
import { mockupRoute, sweepRoutes, type Route } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* Content integrity on rendered pages (task 1.1; test plan §4.8, architecture §14, tasks.md SPA 7).
 *
 * On the visible text of every built route (and /llms.txt, /pricing.md, rebuilt by task 4.4):
 *   - no banned phrase (test/guards/banned-phrases.data.ts, en-IN spelling included, N24);
 *   - the age band "3 to 7" on the pages that must state it, on every article (the 17 template
 *     articles included: 20 articles, 3 with a mockup, since D053 took one off the journal) and in
 *     /llms.txt; nothing that implies under 3;
 *   - no internal material: competitor names, "PostHog" outside /privacy, analytics words, a unit
 *     count other than "first 500 units", which a page prints once (D041) and Home twice, its offer
 *     card and its price FAQ (D061 item 3; task 8c.5); every percentage printed for review (D026);
 *   - no mockup-only markup in the HTML (mk- classes, data-src, review labels; N22);
 *   - JSON-LD restates only what the page shows;
 *   - placeholders listed (beta and development show them; production refuses them, task 2.9).
 * Every rule runs on the 18 approved mockup pages first and must pass there: a rule that would
 * flag approved copy is a broken rule, not a broken page. On a frozen mockup the banned phrases are
 * read through findBannedOnMockup: a claim D058 withdrew after Gate A, which a claim-fixed mockup
 * still prints, is exempt there alone (task 8b.1b; banned-phrases.test.ts proves each exemption).
 */

const AGE_BAND = /\b3 to 7\b/;
const AGE_BAND_MISSING = 'the age band "3 to 7" is missing';
/** The pages that are not articles and must state the age band; every article must too
 *  (needsAgeBand), the three with a mockup and the 17 template articles alike. */
const AGE_BAND_PAGES = new Set<string>(["home", "meet-kheelu", "safety", "ai-toys-for-kids-in-india", "stories", "team", "setup"]);

function needsAgeBand(route: Pick<Route, "id" | "mockup" | "template">): boolean {
  return AGE_BAND_PAGES.has(route.mockup ?? route.id) || route.template === "article";
}
const UNDER_THREE = /\b(?:1|2|two)[- ]year[- ]olds?\b|\btoddlers?\b|\b18 months\b|\b\d{1,2} months old\b|\bbab(?:y|ies)\b/i;
/** The brief's list (test plan §4.8). Case-sensitive, whole words. */
const COMPETITORS =
  /\b(?:Yoto|tonies|Toniebox|Lovevery|KiwiCo|Miko|PlayShifu|Smartivity|Skillmatics|boAt|Lenskart|Mamaearth|The Whole Truth|Wakefit|Allbirds|Warby Parker|Oura)\b/;
const ANALYTICS = /\b(?:sessions?|conversion rate|funnel|bounce rate|pageviews?)\b/i;
const POSTHOG = /\bPostHog\b/;
const UNITS = /\b\d[\d,]*\s+units\b/gi;
const CAP_MORE_THAN_ONCE = '"first 500 units" more than once (D041: once, in the price FAQ)';
const CAP_MORE_THAN_TWICE_ON_HOME = '"first 500 units" more than twice on Home (D061 item 3: the offer card and the price FAQ)';
/** How many times a page may print the 500-unit cap: once (D041: in the price FAQ), and twice on Home, whose offer card
 *  prints the later price while the first-500 price is live (D061 item 3: "Home then says it twice"). */
function capMentionsAllowed(path: string): number {
  return path === "/" ? 2 : 1;
}
const PERCENT = /\b\d+(?:\.\d+)?\s?%/g;
const PLACEHOLDER = /\[PLACEHOLDER[^\]]*\]/g;

/** `mockup`: the approved page the text is (the calibration, the harness self-test), never a built route. */
function contentProblems(path: string, text: string, ageBand: boolean, mockup?: MockupSlug): string[] {
  const out: string[] = [];
  for (const h of mockup ? findBannedOnMockup(mockup, text) : findBanned(text)) out.push(`banned (${h.id}): "${h.match}" in "${h.sentence}"`);
  if (ageBand && !AGE_BAND.test(text)) out.push(AGE_BAND_MISSING);
  const young = UNDER_THREE.exec(text);
  if (young) out.push(`implies under 3: "${young[0]}"`);
  const rival = COMPETITORS.exec(text);
  if (rival) out.push(`competitor name: "${rival[0]}"`);
  const analytics = ANALYTICS.exec(text);
  if (analytics) out.push(`analytics word: "${analytics[0]}"`);
  if (path !== "/privacy" && POSTHOG.test(text)) out.push('"PostHog" outside /privacy');
  const units = [...text.matchAll(UNITS)].map((m) => m[0]);
  const stray = units.filter((u) => !/^500 units$/i.test(u));
  if (stray.length) out.push(`unit counts other than the 500-unit cap: ${stray.join(", ")}`);
  const allowed = capMentionsAllowed(path);
  if (units.filter((u) => /^500 units$/i.test(u)).length > allowed) out.push(allowed === 2 ? CAP_MORE_THAN_TWICE_ON_HOME : CAP_MORE_THAN_ONCE);
  return out;
}

function review(id: string, text: string): void {
  const percents = [...text.matchAll(PERCENT)].map((m) => m[0]);
  const placeholders = [...text.matchAll(PLACEHOLDER)].map((m) => m[0]);
  if (percents.length) console.log(`[content-integrity] ${id}: percentages to review (D026, source marker needed): ${percents.join(", ")}`);
  if (placeholders.length) console.log(`[content-integrity] ${id}: ${placeholders.length} placeholder(s): ${placeholders.join(" | ")}`);
}

/** /llms.txt and /pricing.md: the page rules, the age band in llms.txt, and no /playos link. */
function machineProblems(path: string, body: string): string[] {
  const problems = contentProblems(path, body, path === "/llms.txt");
  if (/\/playos\b/.test(body)) problems.push("links /playos (retired, D041)");
  return problems;
}

const MOCKUP_PATHS: Record<string, string> = { privacy: "/privacy" };

test.describe("content integrity: the D058 exemption is the frozen mockup's alone (task 8b.1b)", () => {
  const withdrawn = "You can delete any of them sooner, in one tap.";
  test("a withdrawn claim home.html still prints passes there, and is red on the built Home and on another mockup", () => {
    expect(contentProblems("/", withdrawn, false, "home")).toEqual([]);
    expect(contentProblems("/", withdrawn, false)).toEqual([`banned (one-tap-delete): "delete any of them sooner, in one tap" in "${withdrawn}"`]);
    expect(contentProblems("/refund", withdrawn, false, "refund")).toHaveLength(1);
  });
});

test.describe("content integrity: the age-band detector", () => {
  const article = { id: "article:busy-hands-no-screens", mockup: null, template: "article" as const };
  test("red on an article without the band, a template article included, and on llms.txt without it", () => {
    expect(needsAgeBand(article)).toBe(true);
    expect(needsAgeBand(mockupRoute("story-talking-toys-and-late-talkers"))).toBe(true);
    expect(contentProblems("/stories/busy-hands-no-screens", "Busy hands, no screens.", needsAgeBand(article))).toContain(AGE_BAND_MISSING);
    expect(machineProblems("/llms.txt", "Kheelu is a plush toy for ages 3+.")).toContain(AGE_BAND_MISSING);
  });
  test("green when the band is there, and not asked of pages that need not state it", () => {
    expect(contentProblems("/stories/busy-hands-no-screens", "Made for children aged 3 to 7.", needsAgeBand(article))).toEqual([]);
    expect(machineProblems("/llms.txt", "Kheelu is a plush toy for ages 3 to 7.")).toEqual([]);
    expect(needsAgeBand(mockupRoute("refund"))).toBe(false);
    expect(machineProblems("/pricing.md", "Kheelu costs the price on the page.")).toEqual([]);
  });
});

/* Task 8c.5 (D061 item 3; the 8c merge's follow-up): Home prints the 500-unit cap twice, its offer card's later price and
   its price FAQ; every other page and both machine files at most once (D041). A third on Home, or a second elsewhere, is
   red. The page's visible text is what counts, so an answer in a closed FAQ item counts only when it is open. */
test.describe("content integrity: the 500-unit cap detector (D041, D061 item 3)", () => {
  const card = "₹4,999 for the first 500 units. ₹7,999 once they are gone.";
  const faq = "Kheelu is ₹4,999 (incl. GST) for the first 500 units, with delivery anywhere in India included.";
  test("Home may print it twice, the offer card and the price FAQ; a third time is red", () => {
    expect(contentProblems("/", card, false)).toEqual([]);
    expect(contentProblems("/", `${card}\n${faq}`, false)).toEqual([]);
    expect(contentProblems("/", `${card}\n${faq}\n${faq}`, false)).toEqual([CAP_MORE_THAN_TWICE_ON_HOME]);
  });
  test("every other page and the machine files once; a second time is red", () => {
    expect(contentProblems("/products/kheelu", card, false)).toEqual([]);
    expect(contentProblems("/products/kheelu", `${card}\n${faq}`, false)).toEqual([CAP_MORE_THAN_ONCE]);
    expect(contentProblems("/terms", `${faq}\n${faq}`, false)).toEqual([CAP_MORE_THAN_ONCE]);
    expect(machineProblems("/llms.txt", `Kheelu is for children aged 3 to 7. ${faq}`)).toEqual([]);
    expect(machineProblems("/llms.txt", `Kheelu is for children aged 3 to 7. ${faq}\n${card}`)).toEqual([CAP_MORE_THAN_ONCE]);
  });
  test("Home's allowance is the home page's alone: a path that merely starts with a slash and more counts once", () => {
    expect(capMentionsAllowed("/")).toBe(2);
    for (const path of ["/products/kheelu", "/home", "/terms", "/llms.txt", "/pricing.md", "/stories/busy-hands-no-screens"]) {
      expect(capMentionsAllowed(path), path).toBe(1);
    }
  });
});

test.describe("content integrity: calibration on the approved mockup", () => {
  for (const slug of MOCKUP_SLUGS) {
    test(slug, () => {
      const text = approvedMockupText(slug as MockupSlug);
      review(`mockup ${slug}`, text);
      expect(contentProblems(MOCKUP_PATHS[slug] ?? `/${slug}`, text, needsAgeBand(mockupRoute(slug as MockupSlug)), slug as MockupSlug)).toEqual([]);
    });
  }
});

for (const route of sweepRoutes()) {
  test.describe(`content integrity: ${route.id}`, () => {
    gateRouteGroup(route);

    test("rendered text, markup and JSON-LD", async ({ harness }) => {
      const { page } = await harness.open(route, VIEWPORTS[1]);
      const text = await page.evaluate(() => document.body.innerText);
      const meta = await page.evaluate(() => `${document.title}\n${document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ""}`);
      const html = await page.content();
      review(route.id, text);
      // In the harness self-test the page is the frozen mockup itself.
      const mockup = PARITY_TARGET === "mockup" ? (route.mockup ?? undefined) : undefined;
      const problems = contentProblems(route.path, `${meta}\n${text}`, needsAgeBand(route), mockup);
      // The mockup is where this scaffolding comes from, so the self-test skips the markup half.
      if (PARITY_TARGET !== "mockup") {
        if (/class="[^"]*\bmk-[a-z]/.test(html)) problems.push("mockup class (mk-) in the HTML");
        if (/\sdata-src="/.test(html)) problems.push("data-src attribute in the HTML");
        if (/Rewritten in the build/.test(html)) problems.push('"Rewritten in the build" label in the HTML');
      }
      problems.push(...jsonLdMismatches(html).map((m) => `JSON-LD: ${m}`));
      if ((route.mockup === "home" || route.mockup === "meet-kheelu") && !AGE_BAND.test(meta)) problems.push("the meta description lacks the age band");
      expect(problems, `${route.id}: content integrity`).toEqual([]);
    });
  });
}

const MACHINE: { path: string; source: string }[] = [
  { path: "/llms.txt", source: "src/app/llms.txt/route.ts" },
  { path: "/pricing.md", source: "src/app/pricing.md/route.ts" },
];
for (const file of MACHINE) {
  test.describe(`content integrity: ${file.path}`, () => {
    requiresServer();
    test(`restates visible copy only: no banned line, no /playos, no internal material${file.path === "/llms.txt" ? ", the age band" : ""}`, async () => {
      const res = await nodeGet(file.path, "marketing" as Route["host"]);
      expect(res.status).toBe(200);
      expect(machineProblems(file.path, res.body)).toEqual([]);
    });
  });
}
