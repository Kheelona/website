# TextArea

A multi-line field with a label, hint or error, and an optional character counter.

**Use it for:** notes for Kheelu ("Anything Kheelu should know?"), support messages, feedback forms.

**Props:** `label`, `hint`, `error`, `maxLength` (shows "73 / 200"), `rows` (default 4), `id`, and any `<textarea>` attributes.

**Rules**
- Always a visible label. Use the hint to say who will read it ("Only you can see it").
- Never ask for sensitive details about a child (health, school, address) in free text.
- Errors say how to fix it, in the same place every time: under the field, in `danger` with an icon.
