import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DRAFT_KEY } from "@/features/preorder/components/form-draft";
import { PENDING_KEY } from "@/features/preorder/components/pending-payment";
import { StoreShell } from "@/layouts/StoreShell/StoreShell";

/**
 * On /thanks the store shell forgets what this tab kept for the pre-order form (D070 / B2, K-172; output/2026-W48/engineering/B2-spec.md
 * acceptance 3): `kh_preorder_pending` and B3's `kh_preorder_draft`, and only on /thanks. The store host serves /thanks
 * from /store/thanks, so the path is the address bar's. Nothing is rendered by the cleanup itself.
 */

function openAt(pathname: string) {
  vi.stubGlobal("location", { ...window.location, pathname });
}
function seedTab() {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify({ v: 1, orderRef: "KH-A2B3-C4D5", rzpOrderId: "order_PROBE000000001", tier: "launch", createdAt: Date.now() }));
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ v: 1, savedAt: Date.now(), parentName: "QA", phone: "9187546483", email: "qa@example.com" }));
  sessionStorage.setItem("unrelated", "keep");
}
const shell = () =>
  render(
    <StoreShell>
      <p>page</p>
    </StoreShell>,
  );

beforeEach(seedTab);
afterEach(() => vi.unstubAllGlobals());

describe("StoreShell clears the tab's payment memory on /thanks only", () => {
  it.each(["/thanks", "/thanks/"])("%s: both keys are removed, nothing else", (path) => {
    openAt(path);
    shell();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(sessionStorage.getItem("unrelated")).toBe("keep");
  });

  it.each(["/", "/e/some-event", "/thanksgiving", "/refund"])("%s: both keys are left alone", (path) => {
    openAt(path);
    shell();
    expect(sessionStorage.getItem(PENDING_KEY)).not.toBeNull();
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull();
  });

  it("adds nothing to the page: the shell's markup is the same with the cleanup in it", () => {
    openAt("/");
    const { container } = shell();
    expect(container.querySelector("main#main")!.textContent).toBe("page");
  });
});
