// ThreeStage is the Home journey world; every child (camera rig, GLB models,
// sun, shape field) lives inside a <Canvas>. Import-smoke via a top-level static
// import (loads at collection time, fails loudly if the module throws).
import * as mod from "./ThreeStage";

describe("ThreeStage", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.default).toBeDefined();
  });
});
