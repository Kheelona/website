# OfferCard

The pre-order box: price, the later price, the ₹499 refundable reserve split, perks, and the one chilli CTA, in a chunky toy-like card.

**Use it for:** the closing section of every selling page, the product page buy box, and the offer slide in decks.

**Props:** `product` ("Kheelu"), `price` (4999), `was` (7999, the announced later price), `deposit` (499), `balance` (price − deposit), `shipDate`, `perks` (string array), `sticker` (text, or `false` to hide), `cta`, `href`, `fine`, and optionally `unitsLeft` + `unitsTotal` from live inventory.

**Rules**
- Defaults match the offer on 8 Oct 2026. Check the store and pass new values when anything changes.
- Show `unitsLeft` only when it is wired to live inventory. Never type a number in.
- Keep "refundable" and "including GST" visible. Never hide the balance.
- One OfferCard per page. Repeat the CTA elsewhere with `Button` or `StickyBuyBar`.
