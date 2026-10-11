# Tabs

Switch between views of the same content without leaving the page, as underlined tabs or a pill-shaped segmented row.

**Use it for:** Today / This week / All conversations; Words / Topics / Feelings in a summary; product details (Specs / In the box / Safety).

**Props:** `tabs` (`{ id, label, icon?, count?, content }`), `value` / `defaultValue`, `onChange`, `variant` (`"pill"`), `label` (accessible name of the tab list).

**Rules**
- 2–5 tabs with 1–2 word labels. The selected tab is marked with an ink underline (Kheelu Blue in Bedtime) or a raised white pill, and its label turns from `text-muted` to `text`.
- Arrow keys move between tabs; only the selected tab is in the Tab order.
- Don't use tabs for steps in a process (use `ProgressBar` and buttons) or to switch Kheelu's modes (use `ModeSwitch`).
