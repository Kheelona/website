#!/usr/bin/env node
/** The whole-site a11y and voice sweep, in one command.
 *
 *  It exists because §8.24-7a's most expensive lesson was a sweep that named
 *  four routes when the site had eleven, and the route it left out carried a
 *  real WCAG failure that stayed live through three "axe zero" rounds. The
 *  route list therefore lives HERE, in code, and covers every HTML route
 *  including the store's, at both widths.
 *
 *  Usage:
 *    npx next start -p 3456        (with store keys, if the store is in scope)
 *    node tools/qa/sweep.mjs
 *
 *  Exits 1 if anything fails, so it can gate a release. */
import { openPage, loadSettled, looksLocal } from "./lib/browser.mjs";
import { axeSourcePath } from "./lib/resolve.mjs";
import { readFileSync } from "node:fs";

const BASE = process.env.SWEEP_BASE ?? "http://127.0.0.1:3456";
const STORE = process.env.SWEEP_STORE ?? "http://store.kheelona.com:3456";

/** Every HTML route. One journal article stands in for the 19, which share a
 *  template; the rest are named individually so none can be forgotten. */
const ROUTES = [
  `${BASE}/`,
  `${BASE}/products/kheelu`,
  `${BASE}/playos`,
  `${BASE}/safety`,
  /* The buyer's guide (2026-09-11). It carries the site's only spec table and
     its only category comparison, so both the voice lint and axe have new
     shapes to check here that exist nowhere else. */
  `${BASE}/ai-toys-for-kids-in-india`,
  `${BASE}/setup`,
  `${BASE}/team`,
  `${BASE}/stories`,
  `${BASE}/stories/how-children-learn-by-talking`,
  `${BASE}/contact`,
  `${BASE}/privacy`,
  `${BASE}/terms`,
  `${BASE}/refund`,
  `${BASE}/shipping`,
  `${BASE}/nope-404`,
  `${STORE}/`,
  /* The public Ideabaaz partner page (2026-08-23). Locally, without store keys
     or with the tier closed, it renders its ended state, which is itself a
     page the voice and axe laws apply to; against production before 31 Aug
     2026 it renders the live ₹99 offer. */
  `${STORE}/ideabaaz`,
  /* The confirmation page's no-cookie state (F-01, 2026-08-23). It used to 404
     without a token in the URL; now that the token arrives in a cookie, a bare
     /thanks is a real page telling a parent how to get back in, so the voice
     and axe laws apply to it like any other. */
  `${STORE}/thanks`,
];

const WIDTHS = [390, 1280];

/** Phrases that must never appear in published text again (§8.25-f), and the
 *  voice laws that apply to every rendered page. Mirrors the RETIRED list in
 *  test/preorder-copy.test.ts — inverted with it on 2026-08-23 (§8.26): the
 *  500-unit cap is BACK as the offer term, and the date-deadline era strings
 *  took its place on this list. */
const FORBIDDEN = [
  [/—/, "em-dash (en-dash only, inside number ranges)"],
  [/no payment/i, "retired: ₹499 is charged now"],
  [/pay nothing/i, "retired: ₹499 is charged now"],
  [/30 September/i, "retired: the date deadline died 2026-08-23, urgency is the 500-unit cap"],
  [/₹9,999/, "retired: the post-cap price is ₹7,999"],
  [/1 October 2026/, "retired: the ship date is 20 October 2026"],
  [/(reserv\w*|spot|place)[\s\S]{0,60}\b(is|it is|it's) free\b/i, "retired: reserving costs a refundable ₹499, nothing about it is free (C1, 2026-09-05)"],
];

/** The one contrast pair the founder has accepted (§8.29, 2026-08-24): white
 *  on brand orange, 2.88:1. Lower-case, because that is how axe reports it. */
const ACCEPTED_ACTION_FILL = "#ef762f";

const axe = readFileSync(axeSourcePath(), "utf8");
let failures = 0;
let acceptedTotal = 0;

for (const width of WIDTHS) {
  const { browser, page } = await openPage({ width, local: looksLocal(BASE) });
  for (const url of ROUTES) {
    let line = `${String(width).padStart(4)}px  ${url.padEnd(58)}`;
    try {
      const response = await loadSettled(page, url);
      const status = response.status();
      const expected = url.endsWith("/nope-404") ? 404 : 200;
      if (status !== expected) {
        line += `HTTP ${status} (expected ${expected})`;
        failures += 1;
        console.log(line);
        continue;
      }

      await page.evaluate(axe);
      const { violations, accepted } = await page.evaluate(async (fill) => {
        const r = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        });

        /* §8.29: white labels on the orange action fill are 2.88:1 and fail AA.
           That is a FOUNDER DECISION taken with the ratio in front of it, not a
           defect, so those nodes are counted separately instead of failing the
           sweep — and they are still PRINTED on every run, because an accepted
           risk that stops being visible stops being accepted and starts being
           forgotten.

           The match is deliberately narrow: this exact foreground on this exact
           background. EVERY OTHER contrast pair, including white on any other
           orange and any future regression, still fails. Disabling the rule
           outright would have been the easy version and would have blinded the
           sweep to the next real one. */
        const isAcceptedNode = (node) =>
          (node.any ?? []).some(
            (check) =>
              check.id === "color-contrast" &&
              check.data?.fgColor?.toLowerCase() === "#ffffff" &&
              check.data?.bgColor?.toLowerCase() === fill,
          );

        const real = [];
        let acceptedCount = 0;
        for (const v of r.violations) {
          if (v.id !== "color-contrast") {
            real.push(`${v.id} (${v.nodes.length})`);
            continue;
          }
          const unexpected = v.nodes.filter((n) => !isAcceptedNode(n));
          acceptedCount += v.nodes.length - unexpected.length;
          if (unexpected.length) real.push(`color-contrast (${unexpected.length})`);
        }
        return { violations: real, accepted: acceptedCount };
      }, ACCEPTED_ACTION_FILL);

      const text = await page.evaluate(() => document.body.innerText);
      const voice = FORBIDDEN.filter(([pattern]) => pattern.test(text)).map(([, why]) => why);

      if (violations.length || voice.length) {
        failures += 1;
        line += `FAIL axe:[${violations.join(", ")}] voice:[${voice.join(", ")}]`;
      } else {
        line += "ok";
      }
      if (accepted) {
        acceptedTotal += accepted;
        line += `  (accepted: ${accepted} white-on-orange, §8.29)`;
      }
    } catch (error) {
      failures += 1;
      line += `ERROR ${error.message.slice(0, 60)}`;
    }
    console.log(line);
  }
  await browser.close();
}

console.log(failures ? `\n${failures} failure(s)` : "\nclean: axe and voice, every route, both widths");
if (acceptedTotal) {
  console.log(
    `${acceptedTotal} accepted contrast violation(s): white on the orange action fill, ` +
      `2.88:1, founder decision 2026-08-24 (docs/website-steps.md §8.29). Not counted as failures.`,
  );
}
process.exit(failures ? 1 : 0);
