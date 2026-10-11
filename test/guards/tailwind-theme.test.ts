import { readFileSync } from "node:fs";
import { join } from "node:path";
import postcss, { type AtRule, type Declaration } from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { describe, expect, it } from "vitest";

/**
 * The Tailwind theme is a bridge to the design system, never a second design system (ADR-002, architecture §4.2).
 *
 * It resets every Tailwind default and maps only three things: colour utilities to the DS colour ROLES (never the
 * primitives), spacing 1-10 to the DS space scale, and the four breakpoints bundle.css hard-codes (DS gap G-03).
 * Radius, shadow, easing, font and type stay out: they belong to the kh- classes and their names collide with
 * DS tokens. Anything else in the file is a second source of visual decisions and fails here.
 */

const ROOT = process.cwd();
const THEME_PATH = join(ROOT, "src/styles/tailwind-theme.css");
const themeCss = readFileSync(THEME_PATH, "utf8");
const tokensJson = JSON.parse(readFileSync(join(ROOT, "design-system/project/tokens.json"), "utf8")) as {
  color: { tokens: Array<{ name: string; value: unknown }> };
};
const bundleCss = readFileSync(join(ROOT, "design-system/project/components/bundle.css"), "utf8");

// DS colour roles: every colour token that is not a raw #rrggbb primitive (tokens.json; 21 roles per wiki/design-system/tokens.md).
const ROLES = tokensJson.color.tokens.filter((t) => !(typeof t.value === "string" && /^#[0-9a-f]{6}$/i.test(t.value))).map((t) => t.name);
const PRIMITIVES = tokensJson.color.tokens.map((t) => t.name).filter((n) => !ROLES.includes(n));

const root = postcss.parse(themeCss);
const themes = root.nodes.filter((n): n is AtRule => n.type === "atrule" && n.name === "theme");
const decls = (themes[0]?.nodes ?? []).filter((n): n is Declaration => n.type === "decl");
const byPrefix = (prefix: string) => decls.filter((d) => d.prop.startsWith(prefix));

describe("tailwind-theme.css", () => {
  it("is one @theme inline block and nothing else", () => {
    expect(themes).toHaveLength(1);
    expect(themes[0].params).toBe("inline");
    expect(root.nodes.filter((n) => n.type !== "comment" && n !== themes[0])).toEqual([]);
  });

  it("starts by dropping every Tailwind default", () => {
    expect(decls[0]?.prop).toBe("--*");
    expect(decls[0]?.value).toBe("initial");
  });

  it("defines no namespace other than colour, spacing, container and breakpoint", () => {
    const others = decls.slice(1).filter((d) => !/^--(color|spacing|container|breakpoint)-/.test(d.prop));
    expect(others.map((d) => d.prop)).toEqual([]);
  });

  it("maps every colour utility to the DS role of the same name, and only to roles", () => {
    expect(ROLES).toHaveLength(21);
    const colours = byPrefix("--color-");
    for (const d of colours) {
      const name = d.prop.slice("--color-".length);
      expect(ROLES, `${d.prop} must name a DS role, not a primitive or a new colour`).toContain(name);
      expect(d.value).toBe(`var(--${name})`);
    }
    expect(colours.map((d) => d.prop.slice(8)).sort()).toEqual([...ROLES].sort());
    for (const p of PRIMITIVES) expect(themeCss).not.toContain(`var(--${p})`);
  });

  it("maps spacing 1-10 to the DS space scale, and the content container to --content-max", () => {
    expect(byPrefix("--spacing-").map((d) => [d.prop, d.value])).toEqual(
      Array.from({ length: 10 }, (_, i) => [`--spacing-${i + 1}`, `var(--space-${i + 1})`]),
    );
    expect(byPrefix("--container-").map((d) => [d.prop, d.value])).toEqual([["--container-content", "var(--content-max)"]]);
  });

  it("uses exactly the four min-width breakpoints bundle.css hard-codes, smallest first", () => {
    const widths = [...new Set([...bundleCss.matchAll(/@media \(min-width: (\d+)px\)/g)].map((m) => Number(m[1])))].sort((a, b) => a - b);
    expect(widths).toHaveLength(4);
    expect(byPrefix("--breakpoint-").map((d) => [d.prop, d.value])).toEqual(
      ["sm", "md", "lg", "xl"].map((name, i) => [`--breakpoint-${name}`, `${widths[i]}px`]),
    );
  });

  it("compiles DS-mapped utilities and nothing from Tailwind's defaults", async () => {
    const probe = `@layer theme, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) source(none);
@import "./tailwind-theme.css";
@source inline("bg-surface text-text-muted p-5 gap-10 max-w-content lg:p-7 bg-red-500 p-11 rounded-lg shadow-lg font-sans text-xl ease-in md:p-4");`;
    const out = (await postcss([tailwindcss()]).process(probe, { from: THEME_PATH })).css;
    expect(out).toMatch(/\.bg-surface \{\s*background-color: var\(--surface\);/);
    expect(out).toMatch(/\.text-text-muted \{\s*color: var\(--text-muted\);/);
    expect(out).toMatch(/\.p-5 \{\s*padding: var\(--space-5\);/);
    expect(out).toMatch(/\.max-w-content \{\s*max-width: var\(--content-max\);/);
    expect(out).toMatch(/@media \(width >= 900px\) \{\s*padding: var\(--space-7\);/);
    expect(out).toMatch(/@media \(width >= 768px\) \{\s*padding: var\(--space-4\);/);
    for (const cls of ["bg-red-500", "p-11", "rounded-lg", "shadow-lg", "font-sans", "text-xl", "ease-in"]) {
      expect(out, `${cls} must produce no CSS`).not.toContain(`.${cls}`);
    }
  });
});
