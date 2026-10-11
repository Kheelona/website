---
paths:
  - "wiki/**/*"
---

# Writing in the wiki

- `wiki/raw/` is immutable: read it, never edit it. New sources are added, never changed.
- Every page starts with YAML front matter: `title`, `type`, `updated`, `sources`.
- Relative links between pages. Each fact lives on ONE page; elsewhere, link to it.
- Every claim cites its raw source, file and line, URL and date, or query and date range.
- Only the main session writes `open-questions.md`, `decisions/`, `index.md`, `log.md` and
  `status.md`. An agent writes only the pages its definition names.
- After a change: update `index.md` if a page was added or retitled, and append to `log.md`
  (`## [YYYY-MM-DD HH:MM] <type> | <summary>`).
