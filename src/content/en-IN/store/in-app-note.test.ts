import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { inAppNote } from "./in-app-note";

/* The store's in-app browser note (task 5.15; store.md fold 2; B12, N7; architecture §16.3). Its words are the approved
 * mockup's. Switched on in task 7.1c (D056 item 3; deviation V4 retired), and switched off for every in-app browser in
 * C2 (D073, 26 Nov 2026), after the founder's test payments passed; the words stay so the switch can go back on. */

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/store.html"), "text/html");
const note = mockup.querySelector(".mk-inapp .kh-alert")!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("in-app browser note", () => {
  it("ships switched off for every browser (C2, D073), and store.md records it", () => {
    expect(inAppNote.enabled).toBe(false);
    expect(readRepoFile("wiki/site/pages/store.md")).toContain("**Switched off for every browser (C2, 2026-11-26).**");
  });

  it("title, body, button and confirmation as the mockup (the store address printed after the body)", () => {
    expect(inAppNote.title).toBe(norm(note.querySelector(".kh-alert__title")!.textContent));
    const body = note.querySelector(".kh-alert__body p")!.cloneNode(true) as Element;
    const host = body.querySelector("strong")!;
    expect(norm(host.textContent)).toBe("store.kheelona.com");
    host.remove();
    expect(inAppNote.body).toBe(norm(body.textContent));
    expect(inAppNote.copyLabel).toBe(norm(note.querySelector("[data-copy]")!.textContent));
    // The mockup's own script writes the confirmation (store.html, "Copy link").
    expect(readRepoFile("mockup/store.html")).toContain(`say.textContent = '${inAppNote.copiedMessage}'`);
  });
});
