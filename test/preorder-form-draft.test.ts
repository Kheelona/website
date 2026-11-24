import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DRAFT_FIELDS,
  DRAFT_KEY,
  DRAFT_TTL_MS,
  clearFormDraft,
  restoreFormDraft,
  saveFormDraft,
} from "@/features/preorder/components/form-draft";

/**
 * The helper behind "the form keeps your name, phone and email in this tab" (D070 / B3; K-171).
 *
 * The founder approved exactly this on 24 Nov 2026: per-tab `sessionStorage`, name, phone and email only, NEVER the
 * child's age, gone on payment or after 30 minutes, nothing long-term. `PreorderForm.test.tsx` is frozen (literal-only
 * patches), so these proofs are a new file. Every expectation is a literal written from the spec
 * (output/2026-W48/engineering/B3-spec.md and the approval), not computed by the code under test. Values are obviously
 * fake. Nothing leaves the process: it is jsdom's own sessionStorage, no network, no tracker.
 */

const NOW = new Date("2026-11-24T10:00:00.000Z");
const MINUTE = 60 * 1000;

/** A form like the store's: the three draft fields, the child's age, and the consent tick. */
function buildForm(values: Partial<Record<"parentName" | "phone" | "email" | "childAge", string>> = {}): HTMLFormElement {
  const form = document.createElement("form");
  form.innerHTML = `
    <input name="parentName" type="text" maxlength="80" />
    <input name="phone" type="tel" />
    <input name="email" type="email" />
    <input name="childAge" type="text" maxlength="20" />
    <input name="accepted" type="checkbox" />`;
  document.body.appendChild(form);
  for (const [name, value] of Object.entries(values)) (form.elements.namedItem(name) as HTMLInputElement).value = value;
  return form;
}

const valueOf = (form: HTMLFormElement, name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;
const stored = () => JSON.parse(sessionStorage.getItem(DRAFT_KEY)!) as Record<string, unknown>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("what is stored", () => {
  it("is one sessionStorage key with exactly { v, savedAt, parentName, phone, email }", () => {
    saveFormDraft(buildForm({ parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com" }));

    expect(DRAFT_KEY).toBe("kh_preorder_draft");
    expect(sessionStorage.length).toBe(1);
    expect(sessionStorage.key(0)).toBe("kh_preorder_draft");
    expect(stored()).toEqual({
      v: 1,
      savedAt: NOW.getTime(),
      parentName: "Asha Probe",
      phone: "9000000001",
      email: "asha@example.com",
    });
    expect(Object.keys(stored()).sort()).toEqual(["email", "parentName", "phone", "savedAt", "v"]);
    expect([...DRAFT_FIELDS]).toEqual(["parentName", "phone", "email"]);
  });

  it("never stores the child's age, even when it is typed, nor the consent tick", () => {
    const form = buildForm({ parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com", childAge: "2.5 years" });
    (form.elements.namedItem("accepted") as HTMLInputElement).checked = true;
    saveFormDraft(form);

    const raw = sessionStorage.getItem(DRAFT_KEY)!;
    expect(raw).not.toContain("2.5 years");
    expect(raw).not.toContain("childAge");
    expect(raw).not.toContain("accepted");
    expect(stored()).not.toHaveProperty("childAge");
    expect(stored()).not.toHaveProperty("accepted");
  });

  it("stores nothing at all when only the child's age is filled in", () => {
    saveFormDraft(buildForm({ childAge: "3" }));
    expect(sessionStorage.length).toBe(0);
  });

  it("uses sessionStorage only: no localStorage and no cookie", () => {
    saveFormDraft(buildForm({ parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com" }));
    expect(localStorage.length).toBe(0);
    expect(document.cookie).toBe("");
  });

  it("removes the key when the three fields are empty (or only spaces), instead of keeping an empty record", () => {
    const form = buildForm({ parentName: "Asha", phone: "", email: "" });
    saveFormDraft(form);
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull();

    (form.elements.namedItem("parentName") as HTMLInputElement).value = "";
    saveFormDraft(form);
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();

    (form.elements.namedItem("phone") as HTMLInputElement).value = "   ";
    saveFormDraft(form);
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("stamps each save with the time of the change, so 30 minutes counts from the last change", () => {
    const form = buildForm({ parentName: "Asha" });
    saveFormDraft(form);
    expect(stored().savedAt).toBe(NOW.getTime());

    vi.setSystemTime(new Date(NOW.getTime() + 10 * MINUTE));
    saveFormDraft(form);
    expect(stored().savedAt).toBe(NOW.getTime() + 10 * MINUTE);
  });
});

describe("restoring", () => {
  function seed(overrides: Record<string, unknown> = {}, savedAt = NOW.getTime()) {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ v: 1, savedAt, parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com", ...overrides }),
    );
  }

  it("fills the three empty fields and leaves the child's age and the tick alone", () => {
    seed();
    const form = buildForm();
    restoreFormDraft(form);

    expect(valueOf(form, "parentName")).toBe("Asha Probe");
    expect(valueOf(form, "phone")).toBe("9000000001");
    expect(valueOf(form, "email")).toBe("asha@example.com");
    expect(valueOf(form, "childAge")).toBe("");
    expect((form.elements.namedItem("accepted") as HTMLInputElement).checked).toBe(false);
  });

  it("does not put back a child's age that somehow sits in the stored value", () => {
    seed({ childAge: "4", accepted: true });
    const form = buildForm();
    restoreFormDraft(form);

    expect(valueOf(form, "childAge")).toBe("");
    expect((form.elements.namedItem("accepted") as HTMLInputElement).checked).toBe(false);
  });

  it("never overwrites a field that already has something (autofill, or what the parent typed)", () => {
    seed();
    const form = buildForm({ parentName: "Autofilled Name", email: "typed@example.com" });
    restoreFormDraft(form);

    expect(valueOf(form, "parentName")).toBe("Autofilled Name");
    expect(valueOf(form, "email")).toBe("typed@example.com");
    expect(valueOf(form, "phone")).toBe("9000000001");
  });

  it("fires no event: a restore is not a change by the person", () => {
    seed();
    const form = buildForm();
    const heard = vi.fn();
    for (const type of ["input", "change", "keydown", "focus"]) form.addEventListener(type, heard, true);
    restoreFormDraft(form);

    expect(heard).not.toHaveBeenCalled();
  });

  it("restores a draft exactly 30 minutes old, and deletes one that is a millisecond older", () => {
    expect(DRAFT_TTL_MS).toBe(30 * MINUTE);

    seed({}, NOW.getTime() - 30 * MINUTE);
    const fresh = buildForm();
    restoreFormDraft(fresh);
    expect(valueOf(fresh, "email")).toBe("asha@example.com");
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull();

    document.body.innerHTML = "";
    seed({}, NOW.getTime() - 30 * MINUTE - 1);
    const stale = buildForm();
    restoreFormDraft(stale);
    expect(valueOf(stale, "parentName")).toBe("");
    expect(valueOf(stale, "phone")).toBe("");
    expect(valueOf(stale, "email")).toBe("");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("expires by the clock: saved now, still there at 29 minutes, gone at 31", () => {
    saveFormDraft(buildForm({ parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com" }));
    document.body.innerHTML = "";

    vi.setSystemTime(new Date(NOW.getTime() + 29 * MINUTE));
    const back = buildForm();
    restoreFormDraft(back);
    expect(valueOf(back, "parentName")).toBe("Asha Probe");

    document.body.innerHTML = "";
    vi.setSystemTime(new Date(NOW.getTime() + 31 * MINUTE));
    const late = buildForm();
    restoreFormDraft(late);
    expect(valueOf(late, "parentName")).toBe("");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it.each([
    ["not JSON", "{oops"],
    ["a wrong version", JSON.stringify({ v: 2, savedAt: NOW.getTime(), parentName: "A", phone: "B", email: "C" })],
    ["no timestamp", JSON.stringify({ v: 1, parentName: "A", phone: "B", email: "C" })],
    ["a field that is not text", JSON.stringify({ v: 1, savedAt: NOW.getTime(), parentName: 7, phone: "B", email: "C" })],
    ["a timestamp in the future", JSON.stringify({ v: 1, savedAt: NOW.getTime() + MINUTE, parentName: "A", phone: "B", email: "C" })],
    ["null", "null"],
  ])("restores nothing from %s, and deletes it", (_label, raw) => {
    sessionStorage.setItem(DRAFT_KEY, raw);
    const form = buildForm();
    restoreFormDraft(form);

    expect(valueOf(form, "parentName")).toBe("");
    expect(valueOf(form, "phone")).toBe("");
    expect(valueOf(form, "email")).toBe("");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("does nothing when there is no draft", () => {
    const form = buildForm();
    restoreFormDraft(form);
    expect(valueOf(form, "parentName")).toBe("");
    expect(sessionStorage.length).toBe(0);
  });
});

describe("clearing", () => {
  it("removes the draft, and only the draft", () => {
    sessionStorage.setItem("something_else", "kept");
    saveFormDraft(buildForm({ parentName: "Asha" }));
    clearFormDraft();

    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(sessionStorage.getItem("something_else")).toBe("kept");
  });

  it("is harmless when there is nothing to clear", () => {
    expect(() => clearFormDraft()).not.toThrow();
  });
});

describe("storage that refuses (private mode, a full quota, blocked site data)", () => {
  const denied = () => new DOMException("The operation is insecure.", "SecurityError");

  it("save, restore and clear never throw when reading `window.sessionStorage` itself throws", () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw denied();
    });
    const form = buildForm({ parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com" });

    expect(() => saveFormDraft(form)).not.toThrow();
    expect(() => restoreFormDraft(form)).not.toThrow();
    expect(() => clearFormDraft()).not.toThrow();
    // The form is exactly as the parent left it.
    expect(valueOf(form, "parentName")).toBe("Asha Probe");
  });

  it("save does not throw when the quota is full (setItem throws)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    });
    expect(() => saveFormDraft(buildForm({ parentName: "Asha" }))).not.toThrow();
  });

  it("restore leaves the form empty when getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw denied();
    });
    const form = buildForm();
    expect(() => restoreFormDraft(form)).not.toThrow();
    expect(valueOf(form, "parentName")).toBe("");
  });

  it("restore and clear do not throw when removeItem throws", () => {
    sessionStorage.setItem(DRAFT_KEY, "not json");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw denied();
    });
    expect(() => restoreFormDraft(buildForm())).not.toThrow();
    expect(() => clearFormDraft()).not.toThrow();
    expect(() => saveFormDraft(buildForm())).not.toThrow();
  });
});
