import { findBanned } from "../guards/banned-phrases.data";
import { isStillLegacy } from "../guards/legacy-paths";
import { GATE_OFF, expect, gateRouteGroup, nodeGet, requiresServer, test } from "./support/fixtures";
import { PARITY_TARGET } from "./support/env";
import { MOCKUP_SLUGS, approvedMockupText, type MockupSlug } from "./support/mockup-text";
import { jsonLdMismatches } from "./support/page-checks";
import { mockupRoute, sweepRoutes, type Route } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* Content integrity on rendered pages (task 1.1; test plan §4.8, architecture §14, tasks.md SPA 7).
 *
 * On the visible text of every built route (and /llms.txt, /pricing.md once rebuilt):
 *   - no banned phrase (test/guards/banned-phrases.data.ts, en-IN spelling included, N24);
 *   - the age band "3 to 7" on the pages that must state it, on every article (the 18 template
 *     articles included) and in /llms.txt; nothing that implies under 3;
 *   - no internal material: competitor names, "PostHog" outside /privacy, analytics words, a unit
 *     count other than "first 500 units" once; every percentage printed for review (D026);
 *   - no mockup-only markup in the HTML (mk- classes, data-src, review labels; N22);
 *   - JSON-LD restates only what the page shows;
 *   - placeholders listed (beta and development show them; production refuses them, task 2.9).
 * Every rule runs on the 18 approved mockup pages first and must pass there: a rule that would
 * flag approved copy is a broken rule, not a broken page.
 */

const AGE_BAND = /\b3 to 7\b/;
const AGE_BAND_MISSING = 'the age band "3 to 7" is missing';
/** The pages that are not articles and must state the age band; every article must too
 *  (needsAgeBand), the three with a mockup and the 18 template articles alike. */
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
const PERCENT = /\b\d+(?:\.\d+)?\s?%/g;
const PLACEHOLDER = /\[PLACEHOLDER[^\]]*\]/g;

function contentProblems(path: string, text: string, ageBand: boolean): string[] {
  const out: string[] = [];
  for (const h of findBanned(text)) out.push(`banned (${h.id}): "${h.match}" in "${h.sentence}"`);
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
  if (units.filter((u) => /^500 units$/i.test(u)).length > 1) out.push('"first 500 units" more than once (D041: once, in the price FAQ)');
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

test.describe("content integrity: calibration on the approved mockup", () => {
  for (const slug of MOCKUP_SLUGS) {
    test(slug, () => {
      const text = approvedMockupText(slug as MockupSlug);
      review(`mockup ${slug}`, text);
      expect(contentProblems(MOCKUP_PATHS[slug] ?? `/${slug}`, text, needsAgeBand(mockupRoute(slug as MockupSlug)))).toEqual([]);
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
      const problems = contentProblems(route.path, `${meta}\n${text}`, needsAgeBand(route));
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
      test.skip(isStillLegacy(file.source) && !GATE_OFF, `pending: ${file.source} is the legacy route until task 4.4 rebuilds it`);
      const res = await nodeGet(file.path, "marketing" as Route["host"]);
      expect(res.status).toBe(200);
      expect(machineProblems(file.path, res.body)).toEqual([]);
    });
  });
}
