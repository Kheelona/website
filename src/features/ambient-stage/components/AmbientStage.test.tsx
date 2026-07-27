// AmbientStage is a <Canvas> child (camera rig + shape field); it cannot mount
// outside a fiber tree, so this is an import-smoke test. The top-level static
// import loads at collection time (no per-test timeout on the `three` transform)
// and fails loudly if the module throws.
import * as mod from "./AmbientStage";

describe("AmbientStage", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.default).toBeDefined();
  });
});
