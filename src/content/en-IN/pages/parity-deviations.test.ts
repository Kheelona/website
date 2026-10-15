import { render } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { FeatureSplit } from "@/components/sections/FeatureSplit/FeatureSplit";
import { FoundersSection } from "@/components/sections/FoundersSection/FoundersSection";
import { RecognitionStrip } from "@/components/sections/RecognitionStrip/RecognitionStrip";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import type { SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import {
  CLAIM_FIXES,
  type ClaimFixesSlug,
  COPY_FIXES,
  type CopyFixesSlug,
  editsBeforeClaimFixes,
  FAQ_FIXES,
  FOOTER_FIX,
  FOOTER_PROMISE,
  passesBeforeSellingCloses,
  SELLING_CLOSES,
  type SellingClosesSlug,
  SETUP_CLOSE,
  SETUP_STEP_BUILD,
  TEAM_BIOS_BUILD,
  TEAM_LEAD_BUILD,
  TEAM_STRIP_BUILD,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { findBanned } from "../../../../test/guards/banned-phrases.data";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../test/support/mockup-facts";
import { setupPage } from "./setup";
import { teamPage } from "./team";

/* The team and setup pages' approved parity deviations (wiki/qa/deviations.md V7, V8; ruled at M1; V7 narrowed by task
 * 6.6, D054 item 20): the build's words the rules accept are the content modules' own, each rule excuses only the
 * mockup lines it names, and each hidden selector finds the element it names on its side. */

/** Every string of a content module, in order. */
const stringsOf = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(stringsOf)
      : value && typeof value === "object"
        ? Object.values(value).flatMap(stringsOf)
        : [];
const TOKEN = buildOffer("token");
const contentSentences = (module: unknown) => stringsOf(module).flatMap((s) => sentences(toPlainText(s, TOKEN)));
const mockupMain = (slug: string) =>
  sentences(htmlToText(new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").querySelector("main")!.outerHTML));
/** A page's rules, all of them or those of one deviation row (`row`, the start of their approvedBy: "deviations.md V7"). */
const rulesOf = (slug: string, row?: string) => (TEXT_DEVIATIONS[slug] ?? []).filter((r) => !row || r.approvedBy.startsWith(`${row} `));
const excused = (slug: string, lines: readonly string[], row?: string) => lines.filter((l) => rulesOf(slug, row).some((r) => r.mockup.test(l)));
const accepted = (slug: string, lines: readonly string[], row?: string) => lines.filter((l) => rulesOf(slug, row).some((r) => r.build?.test(l)));
/** The team page's V7 rows: task 8b.1's claim fixes (V30) have rows of their own, proven below with the other pages'. */
const V7 = "deviations.md V7";
const teamV7Hidden = () => VISUAL_HIDDEN.team.filter((r) => r.approvedBy.startsWith(`${V7} `));

/** One fold of the team page, by kind. */
function teamFold<K extends SectionKind>(kind: K): SectionEntryOf<K> {
  const found = teamPage.sections.find((e) => e.kind === kind) as SectionEntryOf<K> | undefined;
  if (!found) throw new Error(`the team page lists no ${kind}`);
  return found;
}
const teamMockup = () => new DOMParser().parseFromString(readRepoFile("mockup/team.html"), "text/html");

describe("team parity deviations (V7)", () => {
  /* What the build says that the mockup does not: the CMO's lead (M-T1), and the placeholders the founder's answers of
     2026-10-14 resolved (D054 item 20): the three background lines and the strip's two visible names. */
  it("accepts the hero lead, the founders' background lines and the strip's names team.ts renders, and only them", () => {
    const content = contentSentences(teamPage);
    for (const line of [TEAM_LEAD_BUILD, ...TEAM_BIOS_BUILD, ...TEAM_STRIP_BUILD]) expect(content, line).toContain(line);
    expect(accepted("team", content, V7)).toEqual([TEAM_LEAD_BUILD, ...TEAM_BIOS_BUILD, ...TEAM_STRIP_BUILD]);
  });

  it("holds the build's words to the content: every background sentence and every programme shown as text", () => {
    const founders = teamFold("founders-section").config.founders;
    expect(founders.flatMap((f) => sentences(toPlainText(f.bio!.text, TOKEN)))).toEqual([...TEAM_BIOS_BUILD]);
    const strip = teamFold("recognition-strip").config.items;
    expect(strip.filter((i) => !i.mark || i.mark.alt === "").map((i) => i.name)).toEqual([...TEAM_STRIP_BUILD]);
  });

  /* Read from the file, every initials badge is a line of its own, the quote's (fold 4) too: this helper matches lines
     and does not count them, and the text pass excuses a line only as often as the build lacks it (since task 7.1a the
     build lacks all four: the quote's "AS" is Apoorva's photo too, CMO M10). */
  it("excuses exactly the mockup's old lead, its seven placeholder lines (three B24 photos, three F11 backgrounds, the F11 programmes) and the initials", () => {
    expect(excused("team", mockupMain("team"), V7)).toEqual([
      "Kheelu is designed by parents in Bengaluru.",
      "AS",
      "[PLACEHOLDER B24: founder photo]",
      "[PLACEHOLDER F11: Apoorva’s background, shown once its proof is filed (live bio: Chartered Accountant; fifteen years in finance and company-building; the first student at his family’s pre-school, in 1994)]",
      "AS",
      "[PLACEHOLDER B24: founder photo]",
      "[PLACEHOLDER F11: Aman’s background, shown once its proof is filed (live bio: 14 patents filed in his own name; studied AI; machine learning in production)]",
      "KC",
      "[PLACEHOLDER B24: founder photo]",
      "[PLACEHOLDER F11: Kashyap’s background, shown once its proof is filed (live bio: years at Intel leading Thunderbolt 4 and 5 compliance; over a decade in hardware)]",
      "AS",
      "[PLACEHOLDER F11: programme names as plain text, each shown once its proof (acceptance email or listing URL) is filed in wiki/raw/: NVIDIA Inception, Karnataka Elevate, nasscom startups, Founders Inc]",
    ]);
  });

  /* A browser reads each initials badge as a line of its own (a flex item); the build's badges hold photos: the
     founders' three (D054 item 20) and, since task 7.1a, the quote's "AS" (fold 4; CMO built-page review A, M10). The
     next test holds the build to no badge with words. */
  it("excuses the initials, as a browser reads them, and no longer the “Recognised by.” heading", () => {
    expect(excused("team", ["AS", "KC", "Recognised by.", "AS Apoorva Sahu", "Aman Soni"], V7)).toEqual(["AS", "KC"]);
    const initials = Array.from(teamMockup().querySelectorAll(".mk-founder__head .kh-avatar, .kh-quote__avatar")).map((a) => a.textContent);
    expect(initials).toEqual(["AS", "AS", "KC", "AS"]);
  });

  /* The initials rule names no count, and the text pass excuses a mockup line as often as the build lacks it. So the
     whole page, as team.ts renders it, shows no initials badge with words: the four badges the mockup prints (the
     founders' three, the quote's) each hold a photo, and the rule covers exactly those four (V7 review, task 6.6;
     extended by task 7.1a, CMO M10). */
  it("leaves the build no initials badge with words: every badge holds a photo, the founders' three and the quote's", () => {
    const page = render(createElement(PageTemplate, { page: teamPage, offer: TOKEN, path: "/team" })).container;
    const badges = Array.from(page.querySelectorAll(".kh-avatar, .kh-quote__avatar"));
    expect(badges.map((a) => a.textContent)).toEqual(["", "", "", ""]);
    expect(badges.every((a) => a.matches(".kh-avatar") && a.querySelector("img"))).toBe(true);
    expect(badges.slice(0, 3).every((a) => a.closest(".ks-founder__head"))).toBe(true);
    expect(badges[3].closest('section[aria-labelledby="why-title"] .kh-quote__who')).not.toBeNull();
  });

  it("hides the hero lead, the founders' badges, the photo placeholder lines, the background lines, fold 5's line and the quote's badge", () => {
    expect(teamV7Hidden().map((r) => [r.side, r.selector])).toEqual([
      ["mockup", "#hero-title ~ .kh-heading__lead"],
      ["build", "#hero-title ~ .kh-heading__lead"],
      ["mockup", ".mk-founder__head .kh-avatar"],
      ["build", ".ks-founder__head .kh-avatar"],
      ["mockup", ".mk-founder__photo"],
      ["mockup", ".mk-founder__bg"],
      ["build", ".ks-founder__bg"],
      ["mockup", "#recognised-title ~ .kh-body"],
      ["build", "#recognised-title ~ .ks-recognition"],
      ["mockup", ".kh-quote__avatar"],
      ["build", ".kh-quote__who .kh-avatar"],
    ]);
  });

  it("finds on each side exactly the elements it hides", () => {
    const counts = {
      "#hero-title ~ .kh-heading__lead": 1,
      ".mk-founder__head .kh-avatar": 3,
      ".mk-founder__photo": 3,
      ".mk-founder__bg": 3,
      "#recognised-title ~ .kh-body": 1,
      ".kh-quote__avatar": 1,
    };
    const mockup = teamMockup();
    for (const rule of teamV7Hidden().filter((r) => r.side === "mockup")) {
      expect(mockup.querySelectorAll(rule.selector).length, rule.selector).toBe(counts[rule.selector as keyof typeof counts]);
    }
    /* The build's folds as the page renders them, from team.ts. */
    const founders = render(createElement(FoundersSection, teamFold("founders-section").config)).container;
    const strip = render(createElement(RecognitionStrip, teamFold("recognition-strip").config)).container;
    const why = render(createElement(FeatureSplit, { ...teamFold("feature-split").config, offer: TOKEN })).container;
    const build = {
      ".ks-founder__head .kh-avatar": [founders, 3],
      ".ks-founder__bg": [founders, 3],
      "#recognised-title ~ .ks-recognition": [strip, 1],
      ".kh-quote__who .kh-avatar": [why, 1],
    } as const;
    for (const rule of teamV7Hidden().filter((r) => r.side === "build" && r.selector !== "#hero-title ~ .kh-heading__lead")) {
      const [root, n] = build[rule.selector as keyof typeof build];
      expect(root.querySelectorAll(rule.selector).length, rule.selector).toBe(n);
    }
    expect(mockup.querySelector("#hero-title ~ .kh-heading__lead")?.textContent).toMatch(/^Kheelu is designed by parents in Bengaluru\./);
  });
});

describe("setup parity deviations (V8, the founder's page facts V15, and task 7.1b's age line V20)", () => {
  const V8 = TEXT_DEVIATIONS.setup.find((rule) => rule.approvedBy.startsWith("deviations.md V8"))!;
  const FACTS = PAGE_FACTS.setup;
  const factsRule = TEXT_DEVIATIONS.setup.find((rule) => rule.approvedBy === FACTS.approvedBy)!;

  it("is five rules: V8 for step 2's light, the founder's page facts (task 6.7), fold 4's age line (task 7.1b), D058's claim fixes (task 8b.1), then the selling close (task Q2.12)", () => {
    expect(TEXT_DEVIATIONS.setup.map((rule) => rule.approvedBy)).toEqual([
      V8.approvedBy,
      FACTS.approvedBy,
      COPY_FIXES.setup.approvedBy,
      CLAIM_FIXES.setup.approvedBy,
      SELLING_CLOSES.setup.approvedBy,
    ]);
  });

  it("accepts step 2's light, the facts' lines, the age line, D058's lines and the selling close's as setup.ts renders them, and nothing else", () => {
    /* Fold 6's two deletion sentences, D058's words, came off with task Q2.12 (G27; the D2C plan v2 §5). */
    const claims = CLAIM_FIXES.setup.build.filter((line) => !SELLING_CLOSES.setup.mockup.includes(line));
    expect(claims).toHaveLength(CLAIM_FIXES.setup.build.length - 2);
    /* The close's own words; its button, price line and trust line come from cta.ts, the offer and trust.ts. */
    const close = SELLING_CLOSES.setup.build.filter((line) => contentSentences(setupPage).includes(line));
    expect(close).toEqual([SETUP_CLOSE.eyebrow, SETUP_CLOSE.lead]);
    for (const line of [...SETUP_STEP_BUILD, ...FACTS.build, ...COPY_FIXES.setup.build, ...claims]) expect(contentSentences(setupPage)).toContain(line);
    expect(accepted("setup", contentSentences(setupPage))).toEqual([
      FACTS.build[0],
      ...SETUP_STEP_BUILD,
      claims[0],
      ...COPY_FIXES.setup.build,
      claims[1],
      FACTS.build[1],
      claims[2],
      ...close,
    ]);
  });

  it("lists exactly the sentences the founder's facts change (page-facts.ts against the mockup)", () => {
    expect(factSentences(mockupFold("setup", "main"), FACTS.edits)).toEqual({ missing: [...FACTS.mockup], extra: [...FACTS.build] });
  });

  it("excuses and accepts exactly those sentences through its facts rule, and no other line of the page", () => {
    expect(ruleReach(mockupFold("setup", "main"), FACTS.edits, factsRule)).toEqual({ excused: [...FACTS.mockup], accepted: [...FACTS.build] });
  });

  it("hides for the pixels exactly the blocks its facts change, on both sides (VISUAL_HIDDEN)", () => {
    expect(hiddenProblems(mockupFold("setup", "main"), FACTS)).toEqual([]);
    const rules = VISUAL_HIDDEN.setup.filter((r) => r.approvedBy === FACTS.approvedBy);
    expect(rules.map((r) => [r.side, r.selector])).toEqual(
      (["mockup", "build"] as const).flatMap((side) => FACTS.hidden.both.map((selector) => [side, selector])),
    );
  });

  it("hides step 2 on both sides, one element each", () => {
    expect(VISUAL_HIDDEN.setup.filter((r) => r.approvedBy.startsWith("deviations.md V8")).map((r) => [r.side, r.selector])).toEqual([
      ["mockup", ".kh-steps > .kh-step:nth-child(2)"],
      ["build", ".kh-steps > .kh-step:nth-child(2)"],
    ]);
    const doc = new DOMParser().parseFromString(readRepoFile("mockup/setup.html"), "text/html");
    expect(doc.querySelector(".kh-steps > .kh-step:nth-child(2) .kh-step__title")?.textContent).toBe("Press and hold the button on Kheelu’s back.");
  });

  it("excuses through V8 exactly the mockup's step 2 light line: its title is the founder's now (D055 item 25)", () => {
    const light = "Hold it for 3 seconds, until the light starts pulsing blue.";
    expect(readRepoFile("mockup/setup.html")).toContain(light);
    expect(mockupMain("setup").filter((line) => V8.mockup.test(line))).toEqual([light]);
    expect(V8.mockup.test("Press and hold the button on Kheelu’s back.")).toBe(false);
  });
});

/* Task 7.1b's copy fixes (wiki/qa/deviations.md V9 as amended, V17-V21; test/e2e/support/deviations.ts COPY_FIXES): the
 * approved lines the copy pages changed after the built-page reviews (D056 items 2 and 4; CMO review A M4, M5, M6, M8;
 * review B m1). On each of the six pages the rule excuses and accepts exactly the sentences its edits change, and those
 * are exactly the ones the edits make to the frozen mockup; the route tests hold each page's build to that edited
 * mockup, markup and words alike, so the accepted sentences are the ones the content renders. */
describe.each(Object.keys(COPY_FIXES) as CopyFixesSlug[])("%s: task 7.1b's copy fixes as a parity deviation", (slug) => {
  const fixes = COPY_FIXES[slug];
  const main = mockupFold(slug, "main");
  const once = (lines: readonly string[]) => [...new Set(lines)];

  it("lists exactly the sentences the edits change (against the frozen mockup), one build sentence for each approved one", () => {
    expect(factSentences(main, fixes.edits)).toEqual({ missing: [...fixes.mockup], extra: [...fixes.build] });
    expect(fixes.mockup.length).toBeGreaterThan(0);
    expect(fixes.build).toHaveLength(fixes.mockup.length);
  });

  it("is one rule of the page, which excuses and accepts exactly those sentences and no other line", () => {
    const rule = (TEXT_DEVIATIONS[slug] ?? []).filter((r) => r.approvedBy === fixes.approvedBy);
    expect(rule).toHaveLength(1);
    expect(ruleReach(main, fixes.edits, rule[0])).toEqual({ excused: once(fixes.mockup), accepted: once(fixes.build) });
    expect(rule[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the blocks it lists, in VISUAL_HIDDEN in its order, each found once on its side and holding a sentence its edits change (the mockup's side for a hide on both)", () => {
    expect(hiddenProblems(main, fixes)).toEqual([]);
    const rules = (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.approvedBy === fixes.approvedBy);
    const sel = (side: string) => rules.filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...fixes.hidden.both, ...fixes.hidden.mockup]);
    expect(sel("build")).toEqual([...fixes.hidden.both, ...fixes.hidden.build]);
  });

  it("says nothing the CMO's copy review rules out: no “we advise”, no count of families, no “processed within”", () => {
    for (const line of fixes.build) expect(line).not.toMatch(/we advise|Seven families|is processed within|which rules hold up|follow below/);
  });

  it("gives the age-3 advice, wherever it changes, in the CMO's one wording (copy review 7.1b, minor 1; review A M8)", () => {
    for (const line of fixes.build.filter((l) => /grown-up/.test(l))) expect(line).toMatch(/^(If your child is 3, keep a grown-up nearby\.|At 3: keep a grown-up nearby\.)$/);
  });
});

/* Task 8b.1's claim fixes (wiki/qa/deviations.md V26-V36; test/e2e/support/deviations.ts CLAIM_FIXES): the founder's D058
 * has the site follow the live team's code check of 12 October. On each page the rule excuses and accepts exactly the
 * sentences its edits change, those are exactly the ones the edits make to the frozen mockup with the page's earlier
 * rules applied (its page facts, then task 7.1b's copy fixes), and none of its new sentences says a claim D058
 * withdraws. The route and content tests hold each page's build to that edited mockup, markup and words alike. */
const WITHDRAWN =
  /one tap|servers in India|keep none|closed (?:content )?library|curated|age-graded|safety layer|[Tt]opics are open|quiet hours|new-word|thinking skills|weekly report|about a minute|open internet|part of Kheelona\+|Kheelona\+:|attack our own/;

describe.each(Object.keys(CLAIM_FIXES) as ClaimFixesSlug[])("%s: task 8b.1's claim fixes (D058) as a parity deviation", (slug) => {
  const fixes = CLAIM_FIXES[slug];
  const base = withFacts(mockupFold(slug, "main"), editsBeforeClaimFixes(slug));
  const once = (lines: readonly string[]) => [...new Set(lines)];

  it("lists exactly the sentences the edits change, against the frozen mockup with the page's earlier rules applied", () => {
    expect(factSentences(base, fixes.edits)).toEqual({ missing: [...fixes.mockup], extra: [...fixes.build] });
    expect(fixes.mockup.length).toBeGreaterThan(0);
  });

  it("is one rule of the page, the last but a later task's, which excuses and accepts exactly those sentences and no other line", () => {
    const rules = TEXT_DEVIATIONS[slug] ?? [];
    const mine = rules.filter((r) => r.approvedBy === fixes.approvedBy);
    expect(mine).toHaveLength(1);
    // Only a rule whose edits apply to the page as these leave it follows: task 8c.4's FAQ fixes (D061), then task
    // Q2.12's selling closes (D065).
    const later = new Set<string>([...Object.values(FAQ_FIXES), ...Object.values(SELLING_CLOSES)].map((f) => f.approvedBy));
    expect(rules.slice(rules.indexOf(mine[0]) + 1).filter((r) => !later.has(r.approvedBy))).toEqual([]);
    expect(ruleReach(base, fixes.edits, mine[0])).toEqual({ excused: once(fixes.mockup), accepted: once(fixes.build) });
    expect(mine[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the blocks it lists, in VISUAL_HIDDEN in its order, each found once on its side and holding a sentence its edits change (the mockup's side for a hide on both)", () => {
    expect(hiddenProblems(base, fixes)).toEqual([]);
    const rules = (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.approvedBy === fixes.approvedBy);
    const sel = (side: string) => rules.filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...fixes.hidden.both, ...fixes.hidden.mockup]);
    expect(sel("build")).toEqual([...fixes.hidden.both, ...fixes.hidden.build]);
  });

  it("says none of the claims D058 withdraws in a sentence it adds, and names its deviations.md row and D058 as its approval", () => {
    for (const line of fixes.build) expect(line).not.toMatch(WITHDRAWN);
    expect(fixes.approvedBy).toMatch(/^deviations\.md V\d+ \(founder, D058, 2026-10-14; /);
  });
});

/* Task Q2.12's selling closes (D065; the D2C plan v2 §5-§10; test/e2e/support/deviations.ts SELLING_CLOSES): on each page
 * the rule excuses and accepts exactly the sentences its edits change, those are exactly the ones the edits make to the
 * frozen mockup with every earlier rule of the page applied, it is the page's last rule, and none of the words it adds
 * says a claim D058 withdraws or puts GST, the first 500, the balance or the number beside a button. The route and content
 * tests hold each page's build to that edited mockup, markup and words alike. */
describe.each(Object.keys(SELLING_CLOSES) as SellingClosesSlug[])("%s: task Q2.12's selling closes (D065) as a parity deviation", (slug) => {
  const fixes = SELLING_CLOSES[slug];
  const base = passesBeforeSellingCloses(slug).reduce<Element>((el, pass) => withFacts(el, pass), mockupFold(slug, "main"));
  const once = (lines: readonly string[]) => [...new Set(lines)];

  it("lists exactly the sentences the edits change, against the mockup with every earlier rule of the page applied", () => {
    expect(factSentences(base, fixes.edits)).toEqual({ missing: [...fixes.mockup], extra: [...fixes.build] });
    expect(fixes.mockup.length + fixes.build.length).toBeGreaterThan(0);
  });

  it("is the page's last rule, which excuses and accepts exactly those sentences and no other line", () => {
    const rules = TEXT_DEVIATIONS[slug] ?? [];
    const mine = rules.filter((r) => r.approvedBy === fixes.approvedBy);
    expect(mine).toHaveLength(1);
    expect(rules.at(-1)).toBe(mine[0]);
    expect(ruleReach(base, fixes.edits, mine[0])).toEqual({ excused: once(fixes.mockup), accepted: once(fixes.build) });
    expect(mine[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the blocks it lists, in VISUAL_HIDDEN in its order, each found once on its side and holding a sentence its edits change", () => {
    expect(hiddenProblems(base, fixes)).toEqual([]);
    const rules = (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.approvedBy === fixes.approvedBy);
    const sel = (side: string) => rules.filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...fixes.hidden.both, ...fixes.hidden.mockup]);
    expect(sel("build")).toEqual([...fixes.hidden.both, ...fixes.hidden.build]);
  });

  it("adds no withdrawn claim, no GST, first 500 or balance, no number and no banned phrase in a line it adds (D058, D063, D065)", () => {
    for (const line of fixes.build) {
      expect(line).not.toMatch(WITHDRAWN);
      expect(line).not.toMatch(/incl\. GST|first 500|₹4,500|balance|\+91|91875/);
    }
    expect(findBanned(fixes.build.join("\n"))).toEqual([]);
  });

  it("names D065, the plan and this task as its approval, for the main session's deviations.md row", () => {
    expect(fixes.approvedBy).toMatch(/^D065 and the D2C plan v2 §5-§10 \(founder, 2026-10-15; .*task Q2\.12; deviations\.md rows to come\)$/);
  });
});

describe("the footer's promise (task 8b.1; D058 item 1)", () => {
  it("turns the mockup's footer line into the build's, and only that line", () => {
    const footer = (doc: Document) => doc.querySelector("footer.kh-footer")!;
    const mockup = new DOMParser().parseFromString(readRepoFile("mockup/home.html"), "text/html");
    expect(footer(mockup).querySelector(".kh-footer__promise")?.textContent).toBe(FOOTER_PROMISE.mockup);
    const fixed = withFacts(footer(mockup), [FOOTER_FIX]);
    expect(fixed.querySelector(".kh-footer__promise")?.textContent).toBe(FOOTER_PROMISE.build);
    expect(factSentences(footer(mockup), [FOOTER_FIX])).toEqual({ missing: ["No open internet."], extra: ["No web browsing."] });
    expect(FOOTER_PROMISE.build).not.toMatch(WITHDRAWN);
  });
});
