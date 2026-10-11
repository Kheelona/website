# SectionHeading

The headline block for every section: eyebrow, Baloo 2 headline with at most one handwritten phrase or crayon mark, and a Nunito lead.

**Use it for:** opening every web section, landing hero, and email header.

**Props:** `eyebrow` (≤4 words), `title` (a string or nodes; use `Kheelona.Hand` or `Kheelona.Mark` for one accent), `lead`, `align` (`"left"` | `"center"`), `hero` (40px on phones, 56px from 768px, 72px from 1024px), `level` (heading level, default 2), `tone` (colours the eyebrow and accents).

**Helpers**
- `Hand({ tone, children })`: Kalam, tilted −3°, in the tone's deep colour. Use it for one word or a short phrase: "*head start*", "*feeling understood*".
- `Mark({ tone, kind, children })`: a crayon mark under a word, where `kind` is `"underline"` (default), `"highlight"` (marker swipe) or `"circle"`.

**Rules**
- Use one accent per headline, either `Hand` or `Mark`, never both.
- Headlines are one or two short sentences with full stops ("A best friend at 3. A head start for school.").
- Hero headlines appear once per page. Keep leads to two lines.
