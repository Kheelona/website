# TextField

A labelled input with a hint or error underneath, and a 48px tap height.

**Use it for:** app onboarding (the child's first name, birthday, languages), WhatsApp opt-in, and the contact form.

**Props:** `label`, `hint`, `error` (string), `id`, and any `<input>` attributes (`type`, `placeholder`, `defaultValue`, `inputMode`…).

**Rules**
- Always show a visible label. Use placeholders only as examples ("Myra").
- Error messages say how to fix it: "That date does not exist. Try a date like 14/02/2022."
- Ask only for what Kheelu needs. A child's first name is enough; never ask for their surname or school.
