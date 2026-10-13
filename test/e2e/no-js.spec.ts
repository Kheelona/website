import { TEXT_DEVIATIONS } from "./support/deviations";
import { PARITY_TARGET } from "./support/env";
import { expect, forceMotionEnd, gateRouteGroup, test } from "./support/fixtures";
import { mainText, sentenceDiff, sentences } from "./support/parity";
import { sweepRoutes } from "./support/routes";
import { APPROVED_WIDTHS } from "./support/viewports";

/* Server HTML holds the content (task 1.1; architecture §9.5, test plan §4.2).
 *
 * Every built route loaded with JavaScript disabled shows the same <main> text as with it on,
 * apart from interactive extras (the films position line, which a script keeps current, is the
 * only one so far). Without JavaScript the doodles are drawn and the details panels and FAQ
 * answers are in the HTML, because motion arms only under html.js-motion (architecture §11.3).
 */

const vp = APPROVED_WIDTHS[1];
/** Text that only a script writes or rewrites; compared nowhere else. */
const INTERACTIVE = [/^\d+(?:–\d+)? of \d+$/];

for (const route of sweepRoutes()) {
  test.describe(`no-js: ${route.id}`, () => {
    gateRouteGroup(route);

    test("same text with JavaScript off; doodles drawn; answers in the HTML", async ({ harness }) => {
      const { page: on } = await harness.open(route, vp);
      await forceMotionEnd(on);
      const withJs = sentences(await mainText(on));

      const { page: off } = await harness.open(route, vp, { javaScriptEnabled: false });
      const withoutJs = sentences(await mainText(off));
      const { missing, extra } = sentenceDiff(withJs, withoutJs);
      const keep = (list: string[]) => list.filter((s) => !INTERACTIVE.some((re) => re.test(s)));
      if (PARITY_TARGET === "mockup" && route.id === "meet-kheelu" && keep(extra).length) {
        // Known mockup finding: the page's own script (mockup/pages/meet-kheelu.html:397-439) turns the details fold
        // into tabs, hiding panels 2 and 3 with JavaScript on; without it the mockup shows the tab row above all three
        // panels (the DS `.kh-tabs__list { display: flex }` beats `hidden`). The build ships the same tabs (P1, N21
        // corrected, task 3.5) and, without JavaScript, the stacked panels with the tab row hidden (deviations.md V3).
        console.log(`[no-js] self-test: the meet-kheelu mockup shows ${keep(extra).length} more sentences without JavaScript (its tabs script).`);
        extra.length = 0;
      }
      if (PARITY_TARGET === "build" && route.id === "meet-kheelu") {
        // The build's details fold without JavaScript (deviations.md V3, task 5.2): the tab label "Specs" goes with the
        // hidden tab row, and panels 2 and 3 show under their headings. Only that deviation's own sentences pass, and only
        // rules marked for the JavaScript-off run apply here.
        const rules = (TEXT_DEVIATIONS[route.id] ?? []).filter((r) => r.jsOff);
        const applied = [...missing.filter((s) => rules.some((r) => r.mockup.test(s))), ...extra.filter((s) => rules.some((r) => r.build?.test(s)))];
        if (applied.length) console.log(`[no-js] ${route.id}: accepted deviation (deviations.md V3):\n  ${applied.join("\n  ")}`);
        missing.splice(0, missing.length, ...missing.filter((s) => !rules.some((r) => r.mockup.test(s))));
        extra.splice(0, extra.length, ...extra.filter((s) => !rules.some((r) => r.build?.test(s))));
      }
      expect({ missing: keep(missing), extra: keep(extra) }, `${route.id}: text that needs JavaScript to appear`).toEqual({
        missing: [],
        extra: [],
      });

      const undrawn = await off.evaluate(() =>
        Array.from(document.querySelectorAll(".ks-doodle path, .ks-doodle [pathLength]"))
          .filter((p) => Number.parseFloat(getComputedStyle(p).strokeDashoffset || "0") !== 0)
          .map((p) => p.closest("svg")?.getAttribute("class") ?? "svg"),
      );
      expect(undrawn, `${route.id}: doodles not drawn without JavaScript`).toEqual([]);

      const empty = await off.evaluate(() =>
        Array.from(document.querySelectorAll("main details"))
          .filter((d) => (d.textContent ?? "").replace(d.querySelector("summary")?.textContent ?? "", "").trim() === "")
          .map((d) => d.querySelector("summary")?.textContent?.trim() ?? "details"),
      );
      expect(empty, `${route.id}: details without their content in the HTML`).toEqual([]);
    });
  });
}
