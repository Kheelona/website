---
paths:
  - "next.config.ts"
  - "vercel.json"
  - "src/config/**"
---

# Config and environments

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- SITE_ENV comes from src/config/env.ts only; next.config.ts calls resolveSiteEnv(process.env) directly and imports by relative path.
- The money block of src/config/site.ts is frozen; host lists change only as architecture §15.3 says.
- No cacheComponents; the beta noindex header rule stays; the store's six secrets never take a NEXT_PUBLIC_ name.
