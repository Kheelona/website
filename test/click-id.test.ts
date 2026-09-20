import { describe, expect, it } from "vitest";
import {
  CLICK_ID_COOKIE,
  buildFbc,
  clickIdFromUrl,
  looksLikeFbc,
  readClickIdCookie,
} from "@/lib/click-id";

/**
 * Meta's ad click id (§8.41, 2026-09-20).
 *
 * `fbc` reaches Meta today only if Meta's own pixel set the `_fbc` cookie. A
 * browser that blocks the pixel loses the click id entirely and the conversion
 * matches worse. This rebuilds it from the `fbclid` on the landing URL, at the
 * edge, where nothing has to load first.
 *
 * 🔴 WHAT WE STORE IS THE RAW `fbclid`, NEVER A BUILT `fbc`, and that is the
 * main risk control rather than a convention to remember. Storing a rebuilt
 * value would leave two things in the codebase that both look like an `fbc`
 * plus a rule about which wins; storing the raw input means there is exactly
 * ONE place that builds one, and it only runs when Meta's cookie is absent.
 *
 * The format was read off a REAL cookie on production rather than out of the
 * docs: `fb.1.<creation_ms>.<fbclid>`, where `1` is the subdomain index for
 * kheelona.com.
 */
describe("clickIdFromUrl", () => {
  it("takes the click id and the moment it arrived", () => {
    const url = new URL("https://kheelona.com/?fbclid=IwAR0abcDEF123");
    const click = clickIdFromUrl(url, 1789902131589);
    expect(click).toEqual({ id: "IwAR0abcDEF123", ts: 1789902131589 });
  });

  it("is null when the landing carries no click id", () => {
    expect(clickIdFromUrl(new URL("https://kheelona.com/products/kheelu"), 1)).toBeNull();
  });

  /* 🔴 A MISSING fbc IS STRICTLY SAFER THAN A MALFORMED ONE. Meta accepts a
     broken value, answers 200, and silently matches nothing; with no value at
     all it falls back to its other signals. So anything that is not the shape
     of a click id produces NOTHING, never a best effort. */
  it("refuses a malformed click id rather than passing it on", () => {
    for (const bad of ["", "   ", "has spaces", "semi;colon", "quote\"mark", "a".repeat(600)]) {
      expect(clickIdFromUrl(new URL(`https://kheelona.com/?fbclid=${encodeURIComponent(bad)}`), 1), bad).toBeNull();
    }
  });

  it("accepts the base64url alphabet Meta actually uses", () => {
    const id = "IwZXh0bgNhZW0BMABhZGlkAasd-_123";
    expect(clickIdFromUrl(new URL(`https://kheelona.com/?fbclid=${id}`), 5)?.id).toBe(id);
  });
});

describe("buildFbc", () => {
  /* Pinned against a value observed on production, character for character. */
  it("produces exactly the shape Meta's own pixel writes", () => {
    expect(buildFbc({ id: "TESTfbclid123456789", ts: 1789902131589 })).toBe(
      "fb.1.1789902131589.TESTfbclid123456789",
    );
  });

  /* The subdomain index is 1 for kheelona.com. 0 would mean the cookie was set
     on `com`, 2 on `www.kheelona.com`. Getting it wrong is not an error, it is
     an unmatchable id. */
  it("uses the subdomain index for kheelona.com", () => {
    expect(buildFbc({ id: "x1", ts: 7 })!.split(".")[1]).toBe("1");
  });

  it("refuses to build from a click id that is not one", () => {
    expect(buildFbc({ id: "has spaces", ts: 1 })).toBeNull();
    expect(buildFbc({ id: "", ts: 1 })).toBeNull();
    expect(buildFbc({ id: "ok", ts: 0 })).toBeNull();
    expect(buildFbc({ id: "ok", ts: -5 })).toBeNull();
  });
});

describe("readClickIdCookie", () => {
  const withCookie = (v: string) =>
    new Request("https://store.kheelona.com/api/preorder/create-order", {
      headers: { cookie: `${CLICK_ID_COOKIE}=${encodeURIComponent(v)}` },
    });

  /* The point of it being a cookie at all: the ad lands on the apex, the order
     is placed on the store host, and the URL there carries nothing. */
  it("recovers the click on the store host from a cookie set at landing", () => {
    expect(readClickIdCookie(withCookie(JSON.stringify({ id: "IwAR9", ts: 1789 })))).toEqual({
      id: "IwAR9",
      ts: 1789,
    });
  });

  it("is null when there is no cookie", () => {
    expect(readClickIdCookie(new Request("https://store.kheelona.com/"))).toBeNull();
  });

  /* A cookie is client-suppliable, so it is validated exactly as hard as the
     URL was. It must never be able to put a broken id into a Meta payload. */
  it("refuses anything that is not a click id", () => {
    for (const bad of [
      "not json",
      JSON.stringify(["array"]),
      JSON.stringify({ id: "has spaces", ts: 1 }),
      JSON.stringify({ id: "ok" }),
      JSON.stringify({ id: "ok", ts: "later" }),
      JSON.stringify({ ts: 1 }),
    ]) {
      expect(readClickIdCookie(withCookie(bad)), bad).toBeNull();
    }
  });
});

/** THE EARLY WARNING FOR A FORMAT CHANGE (§8.41).
 *
 *  The one risk no test can prevent is Meta altering the `fbc` format, after
 *  which our builder would produce values that are accepted with a 200 and match
 *  nobody, forever, silently. `looksLikeFbc` exists so that case surfaces as a
 *  log line naming the cause rather than as an unexplained fall in match quality.
 *
 *  🔴 IT COMPARES SHAPE, NOT VALUE, and that distinction is the whole design. Two
 *  different `fbc` VALUES in one request is perfectly legitimate — a visitor who
 *  clicks a second advertisement gets a fresh `_fbc` from Meta while we still
 *  hold the first click. Comparing values would fire constantly and be ignored
 *  within a week. */
describe("looksLikeFbc", () => {
  it("accepts the shape Meta writes today", () => {
    expect(looksLikeFbc("fb.1.1789902131589.IwAR0abc")).toBe(true);
    expect(looksLikeFbc(buildFbc({ id: "IwAR0abc", ts: 1789902131589 })!)).toBe(true);
  });

  /* A different subdomain index is still the same FORMAT, so it must not warn:
     www.kheelona.com would legitimately produce a 2. */
  it("does not care which subdomain index Meta used", () => {
    expect(looksLikeFbc("fb.2.1789902131589.IwAR0abc")).toBe(true);
    expect(looksLikeFbc("fb.0.1789902131589.IwAR0abc")).toBe(true);
  });

  it("rejects anything that is not that shape", () => {
    for (const bad of ["", "IwAR0abc", "fb.1.notatime.x", "fb.x.1.y", "fb.1.123", "1.123.abc"]) {
      expect(looksLikeFbc(bad), bad).toBe(false);
    }
  });
});
