# TabBar

The parent app's bottom navigation: 3–5 destinations, each an icon in a pill with a label underneath.

**Use it for:** the parent app's main sections (Today, Conversations, Stories, Settings).

**Props:** `items` (`{ id, label, icon, href?, badge? }`), `value` (the current id), `onChange`, `label`.

**Rules**
- 3–5 items, always with labels. The current item gets a Kheelu Blue pill with a white icon, an ink label and `aria-current="page"`.
- The badge is a sun dot with a number ("3"). It means "new", never "error".
- It respects the phone's safe area at the bottom.
