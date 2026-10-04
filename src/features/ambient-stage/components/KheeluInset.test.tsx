// KheeluInset mounts its own <Canvas> with a suspended GLB plush inside; a bare
// render would try to resolve a real WebGL scene. Import-smoke via a top-level
// static import (loads at collection time, fails loudly if the module throws).
import * as mod from "./KheeluInset";

describe("KheeluInset", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.default).toBeDefined();
  });
});
