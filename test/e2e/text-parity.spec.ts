import { PARITY_TARGET } from "./support/env";
import { parityElsewhere, textDeviations } from "./support/deviations";
import { expect, forceMotionEnd, gateRouteGroup, test } from "./support/fixtures";
import { mainText, sentenceDiff, sentences } from "./support/parity";
import { mockupRoutes } from "./support/routes";
import { APPROVED_WIDTHS } from "./support/viewports";

/* Text parity with the approved mockup (task 1.1 owns the harness; ADR-011; tasks.md SPA 2).
 *
 * The visible text of <main> on the mockup equals the visible text of <main> on the build,
 * normalised and compared sentence by sentence (so a line break that moved does not count), with
 * JavaScript on and again with JavaScript off. Accepted deviations (a resolved placeholder, a
 * founder decision after Gate A) are listed in support/deviations.ts and printed when applied.
 * Text is read at 390 px: the phone layout shows every sentence the laptop does.
 */

const vp = APPROVED_WIDTHS[1];

function unexplained(slug: string, missing: string[], extra: string[]) {
  /* The rule every page shares (task Q2.8's price lines), then the page's own, then D063's (task Q2.3;
     support/seller-facts.ts). */
  const rules = textDeviations(slug);
  const applied: string[] = [];
  const keepMissing = missing.filter((s) => {
    const rule = rules.find((r) => r.mockup.test(s));
    if (rule) applied.push(`"${s}" (${rule.approvedBy}: ${rule.reason})`);
    return !rule;
  });
  const keepExtra = extra.filter((s) => !rules.some((r) => r.build?.test(s)));
  if (applied.length) console.log(`[text-parity] ${slug}: accepted deviations:\n  ${applied.join("\n  ")}`);
  return { missing: keepMissing, extra: keepExtra };
}

for (const route of mockupRoutes()) {
  test.describe(`text parity: ${route.id}`, () => {
    if (PARITY_TARGET === "build") gateRouteGroup(route);
    const elsewhere = PARITY_TARGET === "build" ? parityElsewhere(route.id, "text-parity") : undefined;
    if (elsewhere) console.log(`[text-parity] skipped: ${elsewhere}`);
    test.skip(elsewhere !== undefined, elsewhere);

    for (const js of [true, false]) {
      test(js ? "JavaScript on" : "JavaScript off", async ({ harness }) => {
        // The reference is the mockup as approved (JavaScript on); calibration compares like with like.
        const calibration = PARITY_TARGET === "mockup";
        const { page: mockup } = await harness.openMockup(route.mockup!, vp, { javaScriptEnabled: calibration ? js : true });
        if (!calibration || js) await forceMotionEnd(mockup);
        const expected = sentences(await mainText(mockup));
        expect(expected.length, "the mockup's <main> has text").toBeGreaterThan(3);

        // In calibration, open() loads the mockup again (support/fixtures.ts).
        const { page } = await harness.open(route, vp, { javaScriptEnabled: js });
        if (js) await forceMotionEnd(page);
        const actual = sentences(await mainText(page));

        const diff = sentenceDiff(expected, actual);
        const left = unexplained(route.id, diff.missing, diff.extra);
        expect(
          left,
          `${route.id} (${js ? "JS on" : "JS off"}): sentences the mockup has that the build lacks, and the reverse`,
        ).toEqual({ missing: [], extra: [] });
      });
    }
  });
}
