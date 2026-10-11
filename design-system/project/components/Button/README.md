# Button

The pill button with a chunky toy-like base edge. Five variants, each with one job:

| Variant | Colour | Use it for |
|---|---|---|
| `cta` | Chilli fill (the logo's orange), white text | Buying only: "Pre-order Kheelu", "Reserve for ₹499". One per view. |
| `primary` | Kheelu Blue fill (the logo's sky blue), white text | The main everyday action: "Connect Kheelu", "Save", "Continue". |
| `secondary` | White with an ink outline | Learning and second actions: "See how we built safety in", "Cancel". |
| `ghost` | Underlined text | Quiet links inside cards and notices: "Read the science". |
| `danger` | Red outline (red fill only as a confirm dialog's final button) | Destructive actions: "Delete conversation". |

**Use it for:** every labelled action: buying (`cta`), the main everyday action (`primary`), second actions (`secondary`), quiet links (`ghost`) and destructive actions (`danger`).

Every button sits on the same ink edge (`shadow-press`) and drops 4px onto it when pressed. White on Chilli (2.9:1) and on Kheelu Blue (3.0:1) is below WCAG AA: brand decisions, flagged in **Accessibility & inclusion**.

**Props:** `variant` (default `secondary`), `size` (`"s"` | `"m"` | `"l"`), `icon` / `iconEnd` (an `Icon` name), `loading` (shows a spinner, sets `aria-busy` and disables the button), `block` (full width), `href` (renders an `<a>`), plus normal button attributes. The label is the children.

**Rules**
- Chilli means buying. Never use `cta` for "Save" or "Continue"; that is `primary`.
- One `cta` and one `primary` per view at most. Everything else is secondary or ghost.
- Labels are sentence case and start with a verb, in 2–4 words. No "Click here" or "Submit".
- Sizes: `s` is 40px with `kh-label-s` text and an invisible 48px tap area, for dense rows; `m` is 48px with `kh-label`; `l` is 56px with `kh-label-l`, for the OfferCard, the menu drawer and hero buy buttons.
- Icons go before the label for meaning (WhatsApp, shield) and after it for direction (arrow-right).
- While `loading`, keep the label ("Saving") so the button doesn't change width.
