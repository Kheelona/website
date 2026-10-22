#!/usr/bin/env bash
# Publish the stories: sync the dashboard's posts, generate /stories and every guide, build every page.
#
#   bash tools/publish-stories.sh           the live site's rule (BLOG_SYNC / site env, see below), then generate + build
#   bash tools/publish-stories.sh --api     render straight from the live API (read-only GET); the snapshot is untouched
#
# 1. Sync: website/scripts/journal/sync-posts.mjs, exactly as the live build's prebuild step 15 runs it. BLOG_SYNC=off
#    checks the committed snapshot (src/content/en-IN/stories/posts.generated.json) with no request; BLOG_SYNC=on
#    refreshes it from the API (JOURNAL_API, or BLOG_API_URL); unset, only a production build with JOURNAL_SOURCE "api"
#    reads the API. A post that breaks the journal gate stops here.
# 2. Generate: tools/generate-stories.mjs writes pages/stories.html and pages/stories/<slug>.html for every published
#    post, and deletes the pages of posts that left the dashboard.
# 3. Build: python3 tools/build-pages.py (the shared shell, and pages/_shell/facts.json's owner-confirmed facts).
# Any failure stops the script with a non-zero exit, so a deploy keeps the last good pages.
set -euo pipefail
cd "$(dirname "$0")/.."
NODE_FLAGS=(--experimental-strip-types --disable-warning=ExperimentalWarning --disable-warning=MODULE_TYPELESS_PACKAGE_JSON)

if [[ "${1:-}" == "--api" ]]; then
  echo "publish-stories: rendering from the live API (the snapshot is not touched)"
  node "${NODE_FLAGS[@]}" tools/generate-stories.mjs --api
else
  (cd .. && node "${NODE_FLAGS[@]}" scripts/journal/sync-posts.mjs)
  node "${NODE_FLAGS[@]}" tools/generate-stories.mjs
fi
python3 tools/build-pages.py
