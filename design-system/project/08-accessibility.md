# Accessibility & inclusion

Kheelona is for every family, including parents who use screen readers, grandparents with low vision, and children who are still learning to speak.

## Contrast: the pairs that are allowed

All numbers are WCAG 2 contrast ratios. The minimum is 4.5:1 for text and 3:1 for large text (24px and up), icons, borders and focus rings.

| Text or mark | On | Day | Bedtime |
|---|---|---|---|
| `text` | `surface`, `surface-raised`, `surface-band` | 13.0–15.8 | 13.4–16.6 |
| `text-muted` | the same grounds | 6.0–7.2 | 10.2–12.6 |
| `deep-blue` and `link` | the same grounds | ink, 13.0+ | 4.9–6.1 (Kheelu Blue) |
| `deep-chilli`, `deep-sun` | the same grounds | ink, 13.0+ | 5.0–6.2 (orange), 9.9–12.2 (sunshine) |
| `ink-900` | Sunshine (`sun-500`) | 10.8 | same (fills don't change) |
| White (`on-cta`) | Chilli (`chilli-500`): the buy button, chilli blocks and stickers | **2.9, fails AA** (brand decision) | **2.9** |
| White (`on-primary`, and text on blue blocks, stickers and avatars) | Kheelu Blue (`blue-500`) | **3.0, fails AA** (brand decision) | **3.0** |
| `success`, `danger` | the grounds | 4.7–6.0 | 6.4–10.7 |
| `ink-900` | `warning` (Sunshine badges and icon circles) | 10.8 | 10.8 |
| `border-strong` (controls) | the grounds | 3.4–4.1 | 3.5–4.3 |
| `primary` fills (buttons, checked controls, the selected mode, tags and tab-bar item, progress bars) | the grounds and the progress track | 2.4–3.0: every blue fill carries a white label, tick, dot or thumb, buttons sit on the ink edge, and progress values are written out | 4.9–6.1 |
| `focus` ring | every surface (ink ring on brand fills, set in `bundle.css`) | 13.0+ (5.3+ on fills) | 13.4+ |
| `chalk` lines | the `ink-900` chalkboard | 15.8 | 15.8 |

**The two exceptions: white on Chilli and white on Kheelu Blue.** On 9 Oct 2026 Kheelona chose white text on the logo's orange (#EF762F) for the buy button, chilli blocks and stickers, and on 10 Oct 2026 white on the logo's sky blue (#29A0D7) for everyday buttons, selection, blue blocks and stickers (3.0:1). White on Chilli measures 2.9:1 and white on Kheelu Blue 3.0:1: below WCAG AA for text (4.5:1) and at or just below the 3:1 minimum for large text and icons. Both are kept as brand decisions and flagged here and in the tokens. To keep them as readable as possible, use them only for short, bold labels, icons with a word, and big headlines, never for body text, prices in small type or fine print. If a surface ever has to meet AA (a regulated checkout, say), the passing option is ink on the fill (5.5:1 on Chilli, 5.3:1 on Kheelu Blue); that needs the owner's OK, because the brand rule is white.

**Not allowed:** white or `chalk` text on Sunshine (1.5:1); small or long white text on Chilli or Kheelu Blue; Chilli or Kheelu Blue as text or thin lines on cream, white or the band (2.4–3.0:1; use ink: `deep-blue`, `deep-chilli` and `link` are ink in Day); Sunshine as text, a border or a progress fill on light grounds (1.4:1); `text-muted` on brand fills; `chalk` doodles on light photos (use the ink versions). Kheelu's rainbow is not a UI colour at all.

**The logo** is exempt from contrast rules as a logotype. In its own colours it is 2.7:1 on cream, 2.9:1 on white and 6.1:1 or better on night grounds, so keep it 20px tall or more on light grounds, and use the Ink logo where it must be read small (print, stamps).

## Interaction

- **Touch targets** are at least 48×48 (`tap-min`) for parents and 64×64 (`tap-kid`) for anything a child might press. Smaller visible controls (small buttons and icon buttons, tags, toast buttons, nav links) keep a 48px tap area with an invisible extension; footer links are 48px rows.
- **Focus** is always visible: a 3px (`stroke-focus`) `focus` ring with a 2px offset. Never remove outlines without replacing them.
- **Status** is never shown by colour alone. Success, warning and danger carry an icon and a word ("Connected", "Battery low").
- **Forms** have visible labels (not placeholder-only), hints linked with `aria-describedby`, and errors that say how to fix the problem.
- **Switches** (`Switch`, `ParentControl`) use `role="switch"` with the whole row as the label. Checkboxes and radios are native inputs with a 48px row; their checked state shows a tick or dot, not just a colour.
- **Menus** open with Enter, Space or the down arrow; arrow keys, Home and End move, Escape closes and returns focus to the button.
- **Dialogs** use the native `<dialog>`: focus moves in, Escape closes, and the page behind is inert. The menu drawer keeps Tab inside it and returns focus to the menu button.
- **Tabs** follow the ARIA tabs pattern: arrow keys move between tabs and only the selected tab is in the Tab order.
- **Tooltips** appear on hover and focus, hide with Escape, and never hold essential information.
- **Toasts** are polite live regions and never take focus; anything critical is an `Alert` instead.
- **Motion** respects `prefers-reduced-motion`. Doodle draw-ons and bounces turn into simple fades.

## Images, video and audio

- **Alt text** for every meaningful image follows the formula in **Writing**. Decorative doodles, crayon marks and shapes use `alt=""`.
- **The question in an Imagination frame** is real text (a `figcaption`), not part of the image.
- **Video** has captions in the spoken language, and an English version of regional videos. Never let audio autoplay.
- **Kheelu's voice and pace** stay slow and clear for 3-year-olds, and parents can see transcripts in the app.

## Languages and scripts

- Mark text in another language with `lang` (`hi`, `bn`, `te`, `ta`, `kn`, `es`, `fr`) so screen readers switch voices.
- Use Baloo 2 for Devanagari, and Baloo Da 2, Baloo Tammudu 2, Baloo Thambi 2 and Baloo Tamma 2 for Bengali, Telugu, Tamil and Kannada headlines. Body text uses Noto Sans for that script. Indic scripts need about 10–15% more line height than Latin.
- Never put Indic text into an image when it can be live text.

## Representation

- Show the cast's full range: North and South, girls and boys, a range of skin tones, and multilingual homes.
- Show different family shapes over time: grandparents raising children, single parents, working mothers and hands-on fathers.
- Include children with disabilities and assistive devices (glasses are already in the cast) when we commission real photography, cast authentically and with consent. Don't generate them with AI.
- No stereotypes: boys can tell stories and girls can love rockets.

## Children's privacy in our own materials

- Use real children's images only with written parental consent for that use, and remove them on request.
- Never publish a real child's full name, school or exact location.
- Conversation snippets in marketing must be written by us (clearly illustrative) or used with explicit consent, and must never identify a child.
