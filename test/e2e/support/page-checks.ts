/* Page-level checks shared by the Vitest guards and the Playwright specs (task 1.1).
 * Each works on a whole HTML document (a built page, a served page or a mockup page), so the same
 * rule runs on the prerendered output in `verify` and on the live pages in `verify:e2e`.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { decodeEntities, htmlToText } from "./mockup-text";
import { ROOT, listFiles } from "./repo";

/* ── JSON-LD equals the visible page (architecture §9.2; lessons §6) ─────────────────────── */

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

export function jsonLdBlocks(html: string): Json[] {
  const out: Json[] = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      out.push(JSON.parse(decodeEntities(m[1])) as Json);
    } catch {
      out.push({ "@unparseable": m[1].slice(0, 80) });
    }
  }
  return out;
}

function walk(node: Json, visit: (o: { [k: string]: Json }) => void): void {
  if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
  else if (node && typeof node === "object") {
    visit(node);
    Object.values(node).forEach((v) => walk(v, visit));
  }
}

const norm = (s: string) =>
  s
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[   ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** Indian digit grouping, as the site prints amounts: 499900 paise → "₹4,999". */
export function inr(rupees: number): string {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees)}`;
}

/** Every FAQ answer, price and policy number in the page's JSON-LD that its visible text lacks. */
export function jsonLdMismatches(html: string): string[] {
  const visible = norm(htmlToText(html));
  const problems: string[] = [];
  for (const block of jsonLdBlocks(html)) {
    walk(block, (o) => {
      if (o["@unparseable"]) problems.push(`unparseable JSON-LD: ${String(o["@unparseable"])}`);
      if (o["@type"] === "Answer" && typeof o.text === "string" && !visible.includes(norm(o.text))) {
        problems.push(`FAQ answer not visible: "${o.text.slice(0, 80)}…"`);
      }
      if (o["@type"] === "Offer" && (typeof o.price === "number" || typeof o.price === "string")) {
        const amount = inr(Number(o.price));
        if (!visible.includes(norm(amount))) problems.push(`Offer price ${o.price} (${amount}) not visible`);
      }
      if (typeof o.merchantReturnDays === "number" && !new RegExp(`\\b${o.merchantReturnDays}[- ]days?\\b`).test(visible)) {
        problems.push(`return window ${o.merchantReturnDays} days not visible`);
      }
      const months = o["@type"] === "WarrantyPromise" ? (o.durationOfWarranty as { [k: string]: Json } | undefined)?.value : undefined;
      if (typeof months === "number" && !new RegExp(`\\b${months}[- ]months?\\b`).test(visible)) {
        problems.push(`warranty ${months} months not visible`);
      }
    });
  }
  return problems;
}

/* ── No entrance motion on the money (architecture §11.2; tasks SPA 9) ────────────────────── */

/** Self-contained (no closures), so Playwright can run it in the page with page.evaluate. */
export function revealOnMoneyInDocument(root?: Document | Element): string[] {
  const d = root ?? document;
  const out: string[] = [];
  const main = d.querySelector("main");
  if (!main) return out;
  // The first fold: main's first content child (a hero section, or the store's top block).
  const first = Array.from(main.children).find((c) => !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|LINK)$/.test(c.tagName)) ?? null;
  const MONEY = "h1, .kh-btn--cta, .ks-price, .mk-price, .kh-offer, .kh-buybar, form";
  const describe = (el: Element) =>
    `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).join(".")}` : ""}>`;
  for (const el of Array.from(d.querySelectorAll("[data-reveal]"))) {
    if (first && (el === first || el.contains(first) || first.contains(el))) out.push(`${describe(el)} reveals the first section`);
    const money = el.matches(MONEY) ? el : el.querySelector(MONEY);
    if (money) out.push(`${describe(el)} reveals ${describe(money)}`);
  }
  if (first) {
    for (const el of Array.from(first.querySelectorAll("[data-draw]"))) out.push(`${describe(el)} draws in the first section (pick 2: hero doodles stay still)`);
  }
  return out;
}

/* ── Prerendered HTML, when a build is present and newer than the source ──────────────────── */

export type BuiltPage = { file: string; route: string };

/** Prerendered pages from `next build`, or null when there is no build newer than src/ and content. */
export function freshBuiltPages(): BuiltPage[] | null {
  const app = join(ROOT, ".next", "server", "app");
  const id = join(ROOT, ".next", "BUILD_ID");
  if (!existsSync(app) || !existsSync(id)) return null;
  const built = statSync(id).mtimeMs;
  const newest = Math.max(...listFiles(["src"]).map((p) => statSync(join(ROOT, p)).mtimeMs));
  if (newest > built) return null;
  const pages: BuiltPage[] = [];
  const visit = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) visit(p);
      else if (name.endsWith(".html")) {
        const rel = relative(app, p).replace(/\\/g, "/").replace(/\.html$/, "");
        pages.push({ file: p, route: rel === "index" ? "/" : `/${rel.replace(/\/index$/, "")}` });
      }
    }
  };
  visit(app);
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

/** A built page counts as new design when its <main> holds a DS section (legacy pages have none). */
export function isNewDesignHtml(html: string): boolean {
  const at = html.search(/<main\b/i);
  return at >= 0 && /class="[^"]*\bkh-section\b/.test(html.slice(at));
}
