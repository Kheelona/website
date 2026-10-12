/* axe with the accepted exceptions classified narrowly and printed every run (task 1.1;
 * architecture §13, test plan §4.5, lessons §7 "accepted exceptions are classified, never switched
 * off"). Same engine as the baseline: axe-core 4.12.1 through @axe-core/playwright.
 *
 *   accepted, D041: colour contrast of white on Chilli on the chilli button (.kh-btn--cta);
 *   accepted, D050: the WhatsApp bubble's white glyph on WhatsApp green: the .ks-wa icon link itself
 *     only (the link has a name); its "Chat with us on WhatsApp" label (.ks-wa__label, P13) and any other
 *     visible text inside the bubble are blocking (architecture §13);
 *   accepted, harness: the phone buy bar parked off screen (.kh-buybar.is-hidden) gives axe a false
 *     background (mockup/tools/check.cjs); it is checked when shown, in axe.spec.ts's "sticky bar
 *     shown" state (proven red with KH_E2E_PLANT=buybar);
 *   printed apart, pending the founder: white on Kheelu Blue (.kh-btn--primary, .kh-iconbtn--primary,
 *     blue stickers), which fails the same way but D041 names only Chilli (architecture §13).
 * Every other critical or serious violation fails.
 */
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa", "best-practice"];

export type AxeNodeClass = "blocking" | "accepted-d041" | "accepted-d050" | "accepted-parked-bar" | "apart-blue";
export type AxeFinding = { id: string; impact: string | null; target: string; class: AxeNodeClass; summary: string };

export async function runAxe(page: Page): Promise<{ blocking: AxeFinding[]; accepted: AxeFinding[]; apart: AxeFinding[]; minor: AxeFinding[] }> {
  // @axe-core/playwright types its Page from its own playwright-core copy (1.64); ours is 1.63.
  // The runtime object is the same; only the declared type differs.
  type AxePage = ConstructorParameters<typeof AxeBuilder>[0]["page"];
  const results = await new AxeBuilder({ page: page as unknown as AxePage }).withTags(AXE_TAGS).analyze();
  const nodes = results.violations.flatMap((v) =>
    v.nodes.map((n) => ({ id: v.id, impact: n.impact ?? v.impact ?? null, target: n.target.map(String).join(" "), summary: v.help })),
  );
  const classes = await page.evaluate(
    (list) =>
      list.map(({ id, target }) => {
        if (id !== "color-contrast") return "blocking";
        let el: Element | null = null;
        try {
          el = document.querySelector(target);
        } catch {
          el = null;
        }
        if (!el) return "blocking";
        if (el.closest(".kh-buybar.is-hidden")) return "accepted-parked-bar";
        const wa = el.closest(".ks-wa");
        if (wa) {
          // Only the icon link itself: its glyph is not text, and its name is an aria-label or
          // visually hidden text. Any visible text (the "Chat with us on WhatsApp" label) must pass.
          if (el.closest(".ks-wa__label") || !el.matches("a, .ks-wa")) return "blocking";
          const visible = el.cloneNode(true) as Element;
          visible.querySelectorAll(".ks-wa__label, .kh-sr, .sr-only, svg").forEach((n) => n.remove());
          return (visible.textContent ?? "").trim() ? "blocking" : "accepted-d050";
        }
        if (el.closest(".kh-btn--cta")) return "accepted-d041";
        if (el.closest(".kh-btn--primary, .kh-iconbtn--primary, .kh-sticker.kh-tone-blue")) return "apart-blue";
        return "blocking";
      }),
    nodes.map(({ id, target }) => ({ id, target })),
  );
  const findings: AxeFinding[] = nodes.map((n, i) => ({ ...n, class: classes[i] as AxeNodeClass }));
  const serious = (f: AxeFinding) => f.impact === "critical" || f.impact === "serious";
  return {
    blocking: findings.filter((f) => f.class === "blocking" && serious(f)),
    minor: findings.filter((f) => f.class === "blocking" && !serious(f)),
    accepted: findings.filter((f) => f.class.startsWith("accepted")),
    apart: findings.filter((f) => f.class === "apart-blue"),
  };
}

export function describeFindings(list: AxeFinding[]): string {
  return list.map((f) => `${f.impact} ${f.id} ${f.target} (${f.summary})`).join("\n");
}
