# ListItem and List

Rows for lists of conversations, stories, children and settings: an icon tile or avatar, a title, a subtitle, meta text and a trailing chevron, switch or button. `List` is the rounded white container that groups them.

**Use it for:** the conversation log, story library, children and devices, and settings lists in the parent app.

**Props:**
- `ListItem`: `icon` + `tone` (an icon tile on the cream band, in the tone's text colour) or `avatar` (an `Avatar`), `title`, `subtitle`, `meta` (time or count), `end` (a trailing control such as a switch), `href` or `onClick` (makes the row a link or button with a chevron), `chevron` (`false` to hide).
- `List`: `as` (`"div"` default, or `"ul"` with rows in `<li>`), `plain` (no card), `label`.

**Rules**
- Rows are at least 64px tall. Titles and subtitles truncate to one line each with an ellipsis.
- A row is one tap target. Don't put two links in one row; use `end` for a single control.
- Subtitles carry the facts parents scan for: who, how long, which language.
