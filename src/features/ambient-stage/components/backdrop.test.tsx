// WashBackdrop and Sun read three's scene/camera through useFrame/useThree;
// they only run inside a <Canvas>. Import-smoke via a top-level static import
// (loads at collection time, fails loudly if the module throws).
import * as mod from "./backdrop";

describe("backdrop", () => {
  it("module loads without throwing", () => {
    expect(mod).toBeDefined();
    expect(mod.WashBackdrop).toBeDefined();
    expect(mod.Sun).toBeDefined();
  });
});
