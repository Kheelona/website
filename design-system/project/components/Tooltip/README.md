# Tooltip

A small inverted label that appears on hover or keyboard focus, above or below its trigger.

**Use it for:** naming icon buttons and explaining a setting in a few words.

**Props:** `label` (the text), `placement` (`"top"` default | `"bottom"`), `open` (force it visible, for docs), children (one focusable element).

**Rules**
- 2–8 words. Never put essential information or links in a tooltip; it isn't reachable on touch screens.
- The trigger is linked with `aria-describedby`. Escape hides it (WCAG 1.4.13).
- Don't add tooltips to buttons that already have a visible label.
