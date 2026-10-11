# SocialPost

A 4:5 social post (1080×1350 when exported) built from a brand-colour block, a cast sticker, an optional Kheelu sticker, a Baloo headline with one handwritten phrase, and the brand footer pill.

**Use it for:** Instagram and Facebook feed posts and carousel covers, and as the base for stories and ads.

**Props:** `tone`, `variant` (`"block"` default | `"fur"` | `"board"`), `eyebrow`, `headline`, `hand` (the handwritten ending), `sub`, `kid` (a `*-sticker.png`), `product` (`kheelu-front-sticker.png`), `shape` (`{ src, x, y, w }` cut-paper shape), `brand` (default: the Day logo), `offer` (pill text, or `false`).

**Rules**
- It always renders in the Day theme (it sets `data-theme="light"`).
- Use one child and at most one Kheelu. Faces stay clear of the footer pill and the headline.
- Keep headlines to 3–6 words before the handwritten phrase. The offer pill only appears on selling posts.
- Alternate grounds across the grid (sun → blue → fur → chilli → board). Chilli posts are for offers.
- Text is ink on sun and fur grounds, and white on chilli and blue (2.9:1 and 3.0:1, brand decisions): keep chilli and blue post headlines big and short.
- The component scales with its width (container units). Render it at 540px and export at 2x for 1080×1350.
