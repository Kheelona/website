# NavBar

The site header: the Kheelona logo, up to five links and a small chilli Pre-order button. On phones the links fold into a menu button that opens `NavDrawer`.

**Use it for:** every kheelona.com page.

**Props:** `links` (`{ label, href, current? }`), `cta` (`{ label, href }`), `brand` (the logo's accessible name), `homeHref`, `drawerNote` (a line under the drawer's CTA).

**Rules**
- The logo is the `Logo` component at 30px (auto variant: the logo's orange and sky blue read on cream and on night grounds). Never retype the name in a font.
- Keep the five links (Meet Kheelu, PlayOS, Safety, Stories, Team). Add new pages to the footer, not the header.
- The current page is marked with an ink underline and `aria-current="page"`.
- The menu button announces `aria-expanded`; focus moves into the drawer and returns to the button when it closes.
