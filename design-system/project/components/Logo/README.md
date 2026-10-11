# Logo

The official Kheelona wordmark, flattened from kheelona.com/brand/kheelona-wordmark.svg in its own colours: Chilli, the logo's orange (`#EF762F`), for the K, e, e, o and a, and Kheelu Blue, the logo's sky blue (`#29A0D7`), for the K's ear, h, l and n. The star in the o is white.

**Use it for:** every header, footer, deck, social post, email and document. Never retype "Kheelona" in a font as a logo.

**Props:** `variant`, `mark` (the K only), `height` (px number or any CSS length, default 32), `title` (accessible name, default "Kheelona"), `className`, `style`.

| `variant` | Colours | Use on |
|---|---|---|
| `auto` (default) | The logo's own colours in both themes (they read on cream and on night grounds) | App and website UI |
| `day` | Chilli + Kheelu Blue | Cream, white, light photos |
| `bedtime` | The same as `day` since v7; kept so existing code keeps working | Night grounds, the chalkboard, dark photos |
| `sticker` | Day colours on a white cut-out outline | Sun, chilli and blue colour blocks, busy photos |
| `ink` | All `ink-900` | One-colour print, stamps, embossing, fax-like documents |
| `chalk` | All white | Photos and dark or saturated fills where colour would clash |

**Files:** the Logo asset group has each variant as SVG, the K mark, the app icon and PNG exports (favicon 32, Apple touch icon 180, app icon 512, logo at 2x).

**Rules**
- **Clear space:** keep a margin of at least the height of the K's ear around the logo. Nothing else may enter it.
- **Minimum size:** 20px tall on screen, 6mm tall in print. Below that, use the K mark.
- Never stretch, rotate, outline, add shadows or effects, swap the two colours, or put the full-colour logo on chilli or blue fills (use `sticker` or `chalk`).
- Never place the full-colour logo on a busy photo without the sticker outline.
- One logo per view. In co-branding, the partner logo sits to the right, separated by a `stroke-hair` (1px) rule in `border-strong`.
