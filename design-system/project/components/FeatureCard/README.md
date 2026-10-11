# FeatureCard

A rounded card with a brand-colour icon circle, a title and one or two sentences, in three strengths: plain (white), tint (the cream band) and block (a brand fill).

**Use it for:** feature grids (3 or 4 up), "what's in the box", app onboarding tips.

**Props:** `tone`, `variant` (`"plain"` on `surface-raised` | `"tint"` on `surface-band` | `"block"` on a brand fill: `sun-500`, `blue-500` or `chilli-500`), `icon` (an `Icon` name), `title`, children (body), `link` (`{ href, label }`).

**Rules**
- In a row of cards, use at most one `block`. The others are plain or tint.
- Titles are 2–5 words and bodies at most 2 sentences.
- On a `block`, text is `ink-900` on Sunshine and white on Chilli and Kheelu Blue, and the icon circle turns `chalk` with an ink icon.
- Use real feature names (Story mode, the parent app), never vague ones ("Smart learning").
