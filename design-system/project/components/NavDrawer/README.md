# NavDrawer

The phone menu: a panel that slides in from the right with the logo, the site's links in Baloo 2, and the Pre-order button pinned at the bottom.

**Use it for:** kheelona.com on screens narrower than 900px. `NavBar` opens it from its menu button, so you rarely use it directly.

**Props:** `open`, `onClose`, `links` (`{ label, href, current?, icon? }`), `cta` (`{ label, href }`), `note` (a line under the CTA), `homeHref`, `label`, `inline` (render in place, for docs).

**Rules**
- Same links, same order as the desktop header. The current page is underlined (ink in Day, Kheelu Blue in Bedtime) and has `aria-current="page"`.
- Focus moves to the close button, Tab stays inside the drawer, Escape or the scrim closes it, and focus returns to the menu button.
- One chilli CTA at the bottom, with the ship date or refund note under it.
