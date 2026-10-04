// Pure R3F actors only work inside a <Canvas>; a bare RTL render can't mount
// them. This is an import-smoke test guarding the module graph (three + lib
// imports). The import is TOP-LEVEL and static: it loads at collection time
// (the heavy `three` transform is not bound by the per-test timeout) and fails
// the whole file loudly if the module throws.
import * as mod from "./actors";

describe("actors", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.MascotModel).toBeDefined();
    expect(mod.KheeluModel).toBeDefined();
    expect(mod.BrandShape).toBeDefined();
    expect(mod.ShapeField).toBeDefined();
  });

  it("exposes the SPACING journey constant", () => {
    expect(mod.SPACING).toBe(7);
  });
});
