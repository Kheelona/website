# Tag

A rounded chip that can be toggled (filters), removed (chosen values) or just shown.

**Use it for:** topic filters ("Space", "Feelings"), chosen languages with a remove ×, interest pickers in onboarding.

**Props:** `selected` + `onClick` (toggle; renders a button with `aria-pressed`), `onRemove` (adds a remove button), `icon`, children.

**Rules**
- Selected tags are filled `primary` (Kheelu Blue) with white text and a tick, so the state is not shown by colour alone.
- Keep tag text to 1–2 words. Wrap tags in a group with a label ("Topics").
- The remove button's name is "Remove Kannada", not just "×".
