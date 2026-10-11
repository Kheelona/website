# StickyBuyBar

The phone-only bottom bar with the price and a chilli Pre-order button, shown after the hero scrolls away.

**Use it for:** product and landing pages on screens narrower than 900px.

**Props:** `price` (a display string, for example "₹4,999"), `note` ("Reserve for ₹499 today"), `cta`, `href`.

**Rules**
- Show it after the hero CTA leaves the screen, and hide it when the OfferCard is visible.
- Never cover the cookie or consent banner or the FAQ answers. Leave bottom padding on the page equal to the bar's height.
