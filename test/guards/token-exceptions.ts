/* The ONLY literal values allowed in src/ styling (task 1.1; architecture §4.4; ADR-002).
 *
 * Everything else must be a design-system token (var(--…)), a DS kh- class, or a ks- composition
 * class built on tokens. test/guards/no-off-token.test.ts reads this file and prints every
 * exception it applies on each run (accepted exceptions are printed, never silent: lessons §7).
 * Adding a row here is a design-system decision: a founder decision or a DS gap, never a
 * builder's convenience.
 */

export type CssException = {
  id: string;
  /** Repo-relative file the literal may appear in. */
  file: RegExp;
  /** Declaration property (custom properties included). */
  property: RegExp;
  /** The whole declaration value, trimmed. */
  value: RegExp;
  reason: string;
};

/** The four widths bundle.css hard-codes (DS gap G-03), as min-width breakpoints. */
export const DS_BREAKPOINTS = [720, 768, 900, 1024] as const;
/** Their max-width neighbours, one pixel below (the mockup's "up to" queries). */
export const DS_BREAKPOINT_NEIGHBOURS = DS_BREAKPOINTS.map((w) => w - 1);

/** Zero needs no token: 0, 0px, 0s, 0ms, 0%, 0fr are all allowed, everywhere. */
export const ZERO = /^-?0(?:\.0+)?(?:px|rem|em|s|ms|%|fr|deg)?$/;

/** The only fallbacks a var(--token, X) may carry besides another var() or a zero: keywords
 *  that add no value of their own. Anything else ("var(--space-3, 12px)") is a literal that
 *  ships whenever the token is missing, so it is scanned like any other value and refused. */
export const VAR_FALLBACK_KEYWORDS = /^(?:inherit|initial|unset|transparent|currentcolor|none|auto|normal)$/i;

export const CSS_EXCEPTIONS: readonly CssException[] = [
  {
    id: "outline-offset-2px",
    file: /^src\//,
    property: /^outline-offset$/,
    value: /^2px$/,
    reason: "The DS's own focus-ring offset (bundle.css), restated where a composition class draws a ring.",
  },
  {
    id: "tailwind-breakpoints",
    file: /^src\/styles\/tailwind-theme\.css$/,
    property: /^--breakpoint-(?:sm|md|lg|xl)$/,
    value: new RegExp(`^(?:${DS_BREAKPOINTS.join("|")})px$`),
    reason: "The four DS breakpoints, mapped into the Tailwind theme (architecture §4.2; verified by tailwind-theme.test.ts).",
  },
  {
    id: "ks-nudge",
    file: /^src\/motion\/motion\.css$/,
    property: /^--ks-nudge$/,
    value: /^5px$/,
    reason: "D049 pick 6: the orange button's arrow nudges by the value the founder picked.",
  },
  {
    id: "ks-film-focus",
    file: /^src\/motion\/motion\.css$/,
    property: /^--ks-film-focus$/,
    value: /^1\.05$/,
    reason: "D049 pick 8: the film in focus grows to one value inside the founder's 1.04-1.1 range.",
  },
  {
    id: "ks-wa-green",
    file: /^src\/components\/chrome\/WhatsAppFloat\/whatsapp-float\.css$/,
    property: /^--ks-wa-green$/,
    value: /^#25D366$/i,
    reason: "D050: WhatsApp's brand green #25D366 for the chat bubble, that one hex only (DS gap G-20).",
  },
  // From wiki/engineering/mockup-css-mapping.md §4 (2026-10-12): the approved mockup (D046) ported exactly.
  {
    id: "ds-weight-800",
    file: /^src\/(?:components\/ui\/(?:HelpLine\/help-line|SourceMarker\/source-marker|DefinitionList\/definition-list|PolicyLinks\/policy-links)|components\/sections\/(?:HeroSection\/hero-section|GrievanceBlock\/grievance-block|SellerBlock\/seller-block|ProductDetails\/product-details|AnswerSection\/answer-section|ArticleBody\/article-body|SourcesSection\/sources-section)|layouts\/LegalTemplate\/legal-template)\.css$/,
    property: /^font-weight$/,
    value: /^800$/,
    reason:
      "The DS's emphasis weight for links and labels, restated as bundle.css does (169, 210, 387, 410, 561); the DS has no weight tokens. Weight-only changes in the approved mockup: mockup.css:30,35; contact.css:7,27; meet-kheelu.css:85,91; store-confirmation.css:23; store.css:21; stories.css:110,120; team.css:11; privacy.css:26,54; terms.css:26,54,66; refund.css:33; shipping.css:33.",
  },
  {
    id: "ds-weight-700",
    file: /^src\/(?:components\/ui\/(?:Breadcrumbs\/breadcrumbs|Field\/field)|components\/sections\/(?:FaqSection\/faq-section|StepsSection\/steps-section|ArticleBody\/article-body)|layouts\/LegalTemplate\/legal-template)\.css$/,
    property: /^font-weight$/,
    value: /^700$/,
    reason:
      "The DS's bold weight for text links and row labels, restated as bundle.css does (54, 342, 343, 569, 651, 653); the DS has no weight tokens. Approved mockup: meet-kheelu.css:98; setup.css:9; store.css:60; stories.css:50 (with ks-type-body-s), 64; privacy.css:17,24,38,72; terms.css:17,24,38; refund.css:31,44 and 69 (keeps kh-title's 700 under ks-type-headline@xl); shipping.css:31,44,69.",
  },
  {
    id: "ds-weight-500-legal",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^font-weight$/,
    value: /^500$/,
    reason: "kh-lead's weight (tokens.css:125; bundle.css:179) on the answer-first line at kh-body-l size below 1024 px: privacy.css:42, terms.css:42.",
  },
  {
    id: "ds-underline-offset-3px",
    file: /^src\/(?:layouts\/LegalTemplate\/legal-template|components\/sections\/ArticleBody\/article-body)\.css$/,
    property: /^text-underline-offset$/,
    value: /^3px$/,
    reason: "The DS's own link underline offset (bundle.css:123, 210, 410, 561, 652, 915), restated on the legal and article links: privacy.css:17,25,38,54; terms.css:17,25,38,54; refund.css:32,44; shipping.css:32,44; stories.css:64.",
  },
  {
    id: "legal-step-numeral",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^font$/,
    value: /^800 16px\/20px var\(--font-display\)$/,
    reason: "Numerals in the Sunshine step circles, drawn by ::before, which no class can reach; the DS lets glyphs inside shapes leave the type scale (bundle.css:2-3; .kh-avatar 800 18px/1, .kh-step__num 700 34px/1). refund.css:54, shipping.css:54, terms.css:65.",
  },
  {
    id: "legal-toc-fine-size",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^font-size$/,
    value: /^14px$/,
    reason: "kh-body-s size (tokens.css:128) for the contents list inside (min-width: 1024px) and (pointer: fine) only; touch screens keep 16/24 and no generated type step is pointer-aware. privacy.css:94, terms.css:94.",
  },
  {
    id: "legal-toc-fine-line",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^line-height$/,
    value: /^20px$/,
    reason: "kh-body-s line height (tokens.css:128), same query and lines as legal-toc-fine-size: privacy.css:94, terms.css:94.",
  },
  {
    id: "imagine-zoom",
    file: /^src\/components\/ui\/ImaginationFrame\/imagination-frame\.css$/,
    property: /^transform$/,
    value: /^scale\(1\.32\)$/,
    reason: "The founder's crop of Kabir's imagination frame (log 2026-10-11 10:55, screenshot feedback; mockup.css:130-132, approved D046), with transform-origin 52% 100%. Static: never transitioned.",
  },
  {
    id: "guide-plush-ratio",
    file: /^src\/components\/sections\/FeatureSplit\/feature-split\.css$/,
    property: /^--kh-ratio$/,
    value: /^4 \/ 3$/,
    reason: "The buyer's guide plush board is 4:3 on phones and the DS default 1:1 from 900 px (ai-toys-for-kids-in-india.css:30,32); an inline --kh-ratio cannot change at a breakpoint. The 900 px rule writes --kh-ratio: initial.",
  },
];

/** Lengths allowed inside @media and @container preludes, as (min-width: Npx) or (max-width: Npx)
 *  only: the DS breakpoints and their max-width neighbours. */
export const MEDIA_LENGTHS = {
  "min-width": DS_BREAKPOINTS as readonly number[],
  "max-width": DS_BREAKPOINT_NEIGHBOURS as readonly number[],
};

/** @media preludes allowed in one file only, beyond MEDIA_LENGTHS. `prelude` matches the whole
 *  prelude, trimmed, with runs of whitespace collapsed to one space. */
export type MediaException = { id: string; file: RegExp; prelude: RegExp; reason: string };

export const MEDIA_EXCEPTIONS: readonly MediaException[] = [
  {
    id: "content-max-1200",
    file: /^src\/components\/(?:ui\/StepLoop\/step-loop|sections\/ArticleBody\/article-body)\.css$/,
    prelude: /^@media \(min-width: 1200px\)$/,
    reason: "Approved mockup (D046): the buyer's guide's five checks in one row (ai-toys-for-kids-in-india.css:21) and the safe-AI-toy facts breaking out of the reading column (stories.css:156) from 1200 px, the DS content-max (tokens.css:94; 06-surfaces.md:9). A media query cannot read var(--content-max). DS gap G-03 (wiki/engineering/mockup-css-mapping.md §4.2).",
  },
];

/* Inline `style` (architecture §4.4): only art-board layer positions in percent and their
   rotation, the DS sticker tilt (--kh-tilt, DS 10-pages.md:42-52) and the DS photo ratio
   (--kh-ratio, read by .kh-photo img in bundle.css), all passed as typed props. A value is a
   string literal (INLINE_STYLE_VALUE) or a template literal of the exact shape below; a bare
   variable or expression is refused for positions and the transform, because React renders a
   number in left, top, width or height as pixels. */
export const INLINE_STYLE_KEYS: readonly string[] = [
  "left",
  "right",
  "top",
  "bottom",
  "width",
  "height",
  "transform",
  "--kh-tilt",
  "--kh-ratio",
];
/** Static values an allowed inline-style key may take. */
export const INLINE_STYLE_VALUE: Record<string, RegExp> = {
  left: /^-?\d+(?:\.\d+)?%$/,
  right: /^-?\d+(?:\.\d+)?%$/,
  top: /^-?\d+(?:\.\d+)?%$/,
  bottom: /^-?\d+(?:\.\d+)?%$/,
  width: /^\d+(?:\.\d+)?%$/,
  height: /^\d+(?:\.\d+)?%$/,
  transform: /^rotate\(-?\d+(?:\.\d+)?deg\)$/,
  "--kh-tilt": /^-?\d+(?:\.\d+)?deg$/,
  "--kh-ratio": /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/,
};
/** The shape a template-literal inline-style value must have, each ${…} written as "${}". */
export const INLINE_STYLE_TEMPLATE: Record<string, RegExp> = {
  left: /^\$\{\}%$/,
  right: /^\$\{\}%$/,
  top: /^\$\{\}%$/,
  bottom: /^\$\{\}%$/,
  width: /^\$\{\}%$/,
  height: /^\$\{\}%$/,
  transform: /^rotate\(\$\{\}deg\)$/,
  "--kh-tilt": /^\$\{\}deg$/,
  "--kh-ratio": /^\$\{\}\s*\/\s*\$\{\}$/,
};
/** Keys that may also take a typed prop as is: custom properties, which React passes through
 *  untouched (never as pixels) and the DS reads in one place only (rotate(), aspect-ratio). */
export const INLINE_STYLE_TYPED_KEYS: readonly string[] = ["--kh-tilt", "--kh-ratio"];

/** Generated files are exempt: their drift tests compare them with the DS (structure §8). */
export const EXEMPT_FILES: readonly RegExp[] = [/^src\/styles\/generated\//, /\.generated\./];
