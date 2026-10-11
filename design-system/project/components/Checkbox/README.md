# Checkbox

A 24px checkbox with a 48px tap row, an optional hint, and an indeterminate (dash) state for "some of these".

**Use it for:** independent yes/no choices, consent ("I am Tara's parent or guardian"), and select-all lists.

**Props:** `label`, `hint`, `checked` / `defaultChecked`, `indeterminate`, `disabled`, `onChange`, `id`, and any `<input>` attributes.

**Rules**
- Checked is Kheelu Blue (`primary`) with a white tick.
- Consent checkboxes are never pre-ticked.
- For settings that take effect immediately, use `Switch` instead. Checkboxes are for forms you submit.
