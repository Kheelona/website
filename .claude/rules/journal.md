---
paths:
  - "scripts/journal/**"
  - "src/lib/journal/**"
  - "src/content/en-IN/stories/**"
---

# The journal (ADR-014; wiki/engineering/journal-pipeline.md)

- Article words come from the admin dashboard. Never hand-edit src/content/en-IN/stories/posts.generated.json; refresh it
  with `BLOG_SYNC=on node scripts/journal/sync-posts.mjs`, run `npm run verify`, commit it. Until the flip after Gate B
  (journal-pipeline §9.1, 8b.2g) the committed file equals the approved export (test/fixtures/journal/approved/).
- Pages read Articles from journal.ts; a new block kind needs the dashboard's node first, then the contract (§3), the
  adapter, ProseBlocks and the validator together.
- src/lib/journal/validate.ts and src/config/journal.ts import nothing (Node imports them by type stripping), and
  test/guards/banned-phrases.data.ts stays import-free for the same reason.
- Keep main's env names: BLOG_SYNC, BLOG_API_URL, BLOG_ALLOW_SHRINK. No request to the API outside the prebuild sync.
- Topic rules (the close, the D025 line), the photo table and the hub's overrides are the rebuild's; words are the post's.
