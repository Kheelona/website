# Avatar

A round photo or initials badge for children, parents and Kheelu in the parent app.

**Use it for:** child profiles, family members, list rows and conversation headers.

**Props:** `name` (used for initials and the accessible name), `src` (photo), `alt`, `size` (`"s"` 32 | `"m"` 48 | `"l"` 64 | `"xl"` 96), `tone` (initials background: `blue` default, `chilli`, `sun`).

**Rules**
- Use the family's own photo or initials. Never use cast photos as real users' avatars in the product.
- Initials are white on Kheelu Blue (the default) or Chilli, and ink on Sunshine. Photos crop to the face (centred slightly above the middle).
- Next to a visible name, pass `alt=""` so the name isn't read twice.
