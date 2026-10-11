# ParentControl

A grouped list of labelled switches for the parent's settings: quiet hours, topics, daily summary and similar.

**Use it for:** the parent app's Controls screen and onboarding choices.

**Props:** `items` (an array of `{ icon, tone, label, hint, checked, onChange }`), `label` (group name), `idPrefix`.

**Rules**
- Each row is a real `role="switch"` checkbox with the whole row as its label (72px tall). On is Kheelu Blue (`primary`).
- Hints say exactly what happens: "8:30 pm to 7:00 am. Kheelu sleeps too."
- Defaults should be the protective choice. Changing a protective default asks for confirmation.
