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
];

/** Lengths allowed inside @media and @container preludes, as (min-width: Npx) or (max-width: Npx)
 *  only: the DS breakpoints and their max-width neighbours. */
export const MEDIA_LENGTHS = {
  "min-width": DS_BREAKPOINTS as readonly number[],
  "max-width": DS_BREAKPOINT_NEIGHBOURS as readonly number[],
};

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
