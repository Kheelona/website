# Select

A native dropdown styled to match the text field, with a caret and the same label, hint and error pattern.

**Use it for:** choosing one option from 5–15: story language, the child's age, a time.

**Props:** `label`, `options` (strings or `{ value, label, disabled? }`), `placeholder` (a disabled first option such as "Choose an age"), `hint`, `error`, `id`, and any `<select>` attributes (`value`, `defaultValue`, `onChange`).

**Rules**
- 2–4 options: use `RadioGroup` so all choices are visible. More than 15: use a searchable list.
- The placeholder is an instruction, never a default choice.
- It stays a native `<select>`, so phones show their own picker.
