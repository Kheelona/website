// StageShell wraps a real <Canvas> and wires webglcontextlost on the produced
// canvas element; a bare render has no live GL surface. Import-smoke via a
// top-level static import (loads at collection time, fails loudly if it throws).
import * as mod from "./StageShell";

describe("StageShell", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.StageShell).toBeDefined();
  });
});
