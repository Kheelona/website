import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/* Import boundaries (wiki/engineering/structure.md §6, task 1.1). Regexes rather than
   gitignore-style globs, so relative paths ("../../wiki/x") match as reliably as aliases. */
const SRC_BOUNDARIES = [
  {
    regex: "(^|/)wiki(/|$)",
    message: "src/ never imports the wiki: it is project memory, not content (structure §6).",
  },
  {
    regex: "(^|/)mockup(/|$)",
    message: "src/ never imports the Gate A mockup: port its markup instead (structure §6).",
  },
  {
    // A query suffix ("?raw", "?url") still loads the markdown, so it is matched too.
    regex: "(^@ds/|(^|/)design-system/).*\\.md(\\?.*)?$",
    message: "src/ never imports design-system markdown: the DS is read through its CSS and assets.",
  },
];

/* ui/ is the bottom layer: data by props only (structure §3.2, §6). */
const UI_BOUNDARIES = [
  ...SRC_BOUNDARIES,
  {
    regex: "(^@/|(^|/))content/en-IN(/|$)",
    message: "ui/ never imports content: pass the words in by props (content/types is fine).",
  },
  {
    regex: "(^@/components/|(^|/))sections(/|$)",
    message: "ui/ never imports sections: sections compose ui, not the other way round.",
  },
  {
    regex: "(^@/|(^|/))layouts(/|$)",
    message: "ui/ never imports layouts.",
  },
  {
    regex: "(^@/|^(\\.\\./)+)app(/|$)",
    message: "ui/ never imports app routes.",
  },
];

/* no-restricted-imports reads static imports and export-from only; a dynamic import("../../wiki/x")
   slips past it. The same boundaries, as no-restricted-syntax selectors on ImportExpression: a
   string source, or any static part of a template-literal source. esquery's regex literal cannot
   hold "/", so it is written as \x2F. */
const esqueryRegex = (regex) => regex.replaceAll("/", "\\x2F");
const dynamicImportBans = (boundaries) =>
  boundaries.flatMap(({ regex, message }) => [
    { selector: `ImportExpression > Literal.source[value=/${esqueryRegex(regex)}/]`, message },
    { selector: `ImportExpression > TemplateLiteral.source > TemplateElement[value.raw=/${esqueryRegex(regex)}/]`, message },
  ]);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Not application code (task 1.1): the read-only design system (D005), the frozen Gate A
    // mockup and its local-only _work/ (D046, D039), the wiki, and generated test and QA output.
    "design-system/**",
    "mockup/**",
    "wiki/**",
    "storybook-static/**",
    // Agent worktrees of the build workflow (each a full copy of the repo, with its own build output).
    ".claude/**",
    "test-results/**",
    "playwright-report/**",
    "lighthouse-reports/**",
    "coverage/**",
    "test/e2e/.goldens/**",
    // The redesign as the marketing site (2026-10-22): its build output and cache, its vendored libraries, and the
    // copy of the build that prebuild step 40 puts in public/_site/ (minified, never source).
    "redesign/dist/**",
    "redesign/.cache/**",
    "redesign/assets/vendor/**",
    "public/_site/**",
  ]),
  {
    files: ["src/**/*.{ts,tsx,js,jsx,mjs}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: SRC_BOUNDARIES }],
      "no-restricted-syntax": ["error", ...dynamicImportBans(SRC_BOUNDARIES)],
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx,js,jsx,mjs}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: UI_BOUNDARIES }],
      "no-restricted-syntax": ["error", ...dynamicImportBans(UI_BOUNDARIES)],
    },
  },
  /* Legacy files only (task 1.1). Each entry names exact files that the build must not edit
     yet, and the task that removes the entry. Never widen this block to a folder or to new code. */
  {
    // Frozen store presentation files (ADR-013); restyled by task 6.1, which removes these three.
    files: [
      "src/app/store/_components/NotFoundPanel.tsx",
      "src/app/store/e/[[]event]/page.tsx",
      "src/app/store/ideabaaz/page.tsx",
    ],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  {
    // Tracking gates: bodies frozen byte for byte (tracking freeze), moved by task 2.6 to
    // src/components/tracking/ unchanged (task 6.3 dropped the old molecules/ paths with the legacy
    // folder); the rule returns only if a founder decision lets the gate bodies change.
    files: ["src/components/tracking/GoogleAnalyticsGate.tsx", "src/components/tracking/MetaPixel.tsx"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    // The redesign as the marketing site (2026-10-22): every marketing page is a whole document served by the optional
    // catch-all route handler src/app/(site)/[[...path]], never a client-routed React page, so <Link> buys nothing; and
    // the rule reads that catch-all as a page for EVERY internal path, so it would flag each <a href="/…"> in the
    // store's pages, the components' tests and stories.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
]);

export default eslintConfig;
