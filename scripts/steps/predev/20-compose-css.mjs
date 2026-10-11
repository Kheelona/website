// predev step 20 (task 1.2): write src/styles/generated/compose.css before `next dev` or Storybook starts, so
// site.css finds the manifest of colocated component CSS. Run by scripts/run-steps.mjs; a throw exits non-zero.
import { relative } from "node:path";
import { buildComposeCss } from "../../assets/build-compose-css.mjs";

const { path, files } = buildComposeCss();
console.log(`compose.css: ${files.length} component CSS file(s) -> ${relative(process.cwd(), path)}`);
