#!/bin/bash
# Minify the hand-written CSS/JS that index.html loads (site.min.css, main.min.js). Run after editing either source.
set -euo pipefail
cd "$(dirname "$0")/.."
../node_modules/.bin/esbuild assets/css/site.css --minify --outfile=assets/css/site.min.css --log-level=warning
../node_modules/.bin/esbuild assets/js/main.js --minify --outfile=assets/js/main.min.js --log-level=warning
echo "minified"
