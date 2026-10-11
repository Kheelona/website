# RadioGroup

A labelled set of radio buttons (a native fieldset) for choosing exactly one option, stacked or inline.

**Use it for:** bedtime, voice and language choices in the app; delivery options at checkout.

**Props:** `label` (the question, as the legend), `name`, `options` (`{ value, label, hint?, disabled? }`), `value` / `defaultValue`, `onChange`, `inline`.

**Rules**
- 2–5 options. Phrase the label as a question ("When should Kheelu stop for the night?").
- Pre-select the protective or most common choice, and say why in its hint.
- Use `inline` only for 2–3 short options.
- Checked is a Kheelu Blue disc (`primary`) with a white dot, like the checkbox's tick.
