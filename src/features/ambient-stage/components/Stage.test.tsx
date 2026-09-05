// Stage is the single dynamic three entry: it forks to ThreeStage/AmbientStage,
// both of which are <Canvas> scenes. Import-smoke via a top-level static import
// (loads at collection time, fails loudly if the module throws), covering its
// default export and the named KheeluInset re-export.
import * as mod from "./Stage";

describe("Stage", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.default).toBeDefined();
    expect(mod.KheeluInset).toBeDefined();
  });
});
