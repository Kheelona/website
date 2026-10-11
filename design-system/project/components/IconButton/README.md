# IconButton

A round, icon-only button for compact, well-known actions: close, menu, more, share, play.

**Use it for:** dialog and drawer close buttons, toolbar actions, list-row actions, the player's play button.

**Props:** `icon` (an `Icon` name), `label` (required: the accessible name, also shown as a native tooltip), `variant` (`"ghost"` default | `"outline"` | `"primary"`), `size` (`"s"` 40px | `"m"` 48px | `"l"` 56px), `href`, plus normal button attributes.

**Rules**
- Only for actions everyone recognises from the icon alone. If you have to explain it, use a `Button` with a label.
- `label` is mandatory. Screen readers read it; the icon is hidden from them.
- `primary` (Kheelu Blue) is for the one main action of a small area, such as play or talk. Buying never uses an icon-only button.
- Size `s` keeps a 48px tap area with an invisible extension, so it is safe on phones.
