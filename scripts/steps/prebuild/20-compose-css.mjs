// prebuild step 20 (task 1.2): write src/styles/generated/compose.css before `next build`, so site.css finds the
// manifest of colocated component CSS (it is git-ignored, so a fresh clone has none). Run by
// scripts/run-steps.mjs after step 10 (DS checksums); a throw exits non-zero and stops the build.
import { relative } from "node:path";
import { buildComposeCss } from "../../assets/build-compose-css.mjs";

const { path, files } = buildComposeCss();
console.log(`compose.css: ${files.length} component CSS file(s) -> ${relative(process.cwd(), path)}`);
