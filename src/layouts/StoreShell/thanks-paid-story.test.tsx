import { cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signAddressToken } from "@/lib/store/signing";
import { FULL_TIER } from "@/lib/store/mode";
import { THANKS_PATH, formatThanksSession } from "@/lib/store/thanks-session";
import { THANKS_PAID } from "../../../test/fixtures/store/thanks-paid";
import { fakeClient, fakeEnv, type QueryResult } from "../../../test/helpers/fake-supabase";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { StoreShell } from "./StoreShell";
import meta, { ThanksPaid } from "./StoreShell.stories";

/* The /thanks paid-state composition (task 4.8 item 3; wiki/qa/deviations.md V5). The route's own specs open /thanks with
 * no order, so they see the link-needed state; the paid state the approved mockup shows is a Storybook story
 * (StoreShell.stories.tsx `ThanksPaid`: the five folds and the page's close inside the store chrome, from a fixture
 * order), which test/e2e/thanks-paid.spec.ts compares with mockup/store-confirmation.html at 360, 390 and 1440. This
 * test proves the story IS the route: the store layout's shell around exactly what src/app/store/thanks/page.tsx renders
 * for the same order, rendered through the route itself (a signed cookie and a stand-in for the order query, as the
 * frozen page test drives it), so the composition can never drift from the page while the page's logic stays untouched
 * (ADR-013). No real order, no test-only route, no switch in the page. */

let results: Record<string, QueryResult> = {};
let cookieValue: string | undefined;
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => fakeEnv }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined) }),
}));

const { order } = THANKS_PAID;

/** React's generated ids (useId: the fields' ids and the labels' `for`) differ between two renders; nothing else may. */
const html = (el: Element) => el.innerHTML.replace(/_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g, "ID");

async function route(): Promise<HTMLElement> {
  results = { "preorders.select": { data: { ...order } } };
  cookieValue = formatThanksSession(order.order_ref, signAddressToken(fakeEnv.signingSecret, order.order_ref, Date.now() + 3_600_000))!;
  const { default: ThanksPage } = await import("@/app/store/thanks/page");
  return render(await ThanksPage()).container;
}

function story(): HTMLElement {
  const draw = ThanksPaid.render as unknown as () => ReactElement;
  return render(draw()).container;
}

describe("the /thanks paid-state story (StoreShell.stories.tsx ThanksPaid)", () => {
  beforeEach(() => {
    results = {};
    cookieValue = undefined;
  });
  afterEach(() => cleanup());

  it("is the state the approved mockup shows: a token order, paid, no address yet (store-confirmation.html)", () => {
    expect(order.status).toBe("paid");
    expect(order.tier).not.toBe(FULL_TIER);
    expect(order.address).toBeNull();
    expect(readRepoFile("mockup/pages/store-confirmation.html")).toContain("The paid state of a token order with no address yet.");
  });

  it("its main is exactly what the route renders for the fixture order", async () => {
    const page = await route();
    expect(page.querySelector(".ph-no-capture.ph-mask h1")?.textContent).toBe("Your Kheelu is reserved.");
    const main = story().querySelector("main#main")!;
    expect(html(main)).toBe(html(page));
  });

  it("its chrome is the store layout's shell, as the route has it", () => {
    const shell = render(<StoreShell>{null}</StoreShell>).container;
    shell.querySelector("main")!.replaceChildren();
    const composed = story();
    composed.querySelector("main")!.replaceChildren();
    expect(composed.innerHTML).toBe(shell.innerHTML);
    expect(readRepoFile("src/app/store/layout.tsx")).toContain("<StoreShell>{children}</StoreShell>");
  });

  it("is the one story the parity spec opens, at the store's /thanks path", () => {
    expect(meta.title).toBe("Layouts/StoreShell");
    expect(ThanksPaid.name).toBe("Thanks paid");
    expect(readRepoFile("test/e2e/thanks-paid.spec.ts")).toContain("layouts-storeshell--thanks-paid");
    expect(THANKS_PATH).toBe("/thanks");
  });
});
