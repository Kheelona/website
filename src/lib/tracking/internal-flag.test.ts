import { describe, expect, it } from "vitest";
import { STAMPED_PROPERTIES } from "@/lib/tracking/events";
import { INTERNAL_PROPERTY, applyInternalFlag, internalFlagFrom } from "./internal-flag";

/** B46 (gate-a-open-items; open questions C7): a team device opens any page once with
 *  `?internal=1` and PostHog carries `internal: true` on every later event from it, so the
 *  "Internal / Test users" cohort can finally hold members. `?internal=0` clears it. A new
 *  property, never a renamed or extra event. */
function recorder() {
  const calls: string[] = [];
  return {
    calls,
    target: {
      register: (props: Record<string, unknown>) => calls.push(`register ${JSON.stringify(props)}`),
      unregister: (name: string) => calls.push(`unregister ${name}`),
    },
  };
}

describe("internalFlagFrom", () => {
  it("reads ?internal=1 as set and ?internal=0 as clear", () => {
    expect(internalFlagFrom("?internal=1")).toBe("set");
    expect(internalFlagFrom("?internal=0")).toBe("clear");
  });

  it("finds the flag among other query parameters, with or without the leading ?", () => {
    expect(internalFlagFrom("?utm_source=meta&internal=1&placement=feed")).toBe("set");
    expect(internalFlagFrom("internal=0")).toBe("clear");
  });

  it("ignores every other value, so a typo never marks or unmarks a device", () => {
    for (const search of ["", "?", "?internal", "?internal=", "?internal=true", "?internal=2", "?internal=01", "?Internal=1", "?utm_source=internal"]) {
      expect(internalFlagFrom(search), search).toBeNull();
    }
  });
});

describe("applyInternalFlag", () => {
  it("?internal=1 registers internal: true (a boolean), and nothing else", () => {
    const { calls, target } = recorder();
    expect(applyInternalFlag(target, "?internal=1")).toBe("set");
    expect(calls).toEqual(['register {"internal":true}']);
  });

  it("?internal=0 unregisters internal, and nothing else", () => {
    const { calls, target } = recorder();
    expect(applyInternalFlag(target, "?internal=0")).toBe("clear");
    expect(calls).toEqual(["unregister internal"]);
  });

  it("does nothing without the flag: no register, no unregister", () => {
    const { calls, target } = recorder();
    expect(applyInternalFlag(target, "?utm_source=meta")).toBeNull();
    expect(applyInternalFlag(target, "")).toBeNull();
    expect(calls).toEqual([]);
  });

  /* The registry (task 1.4) records the property; this module must send exactly that. */
  it("sends the property the registry records for B46", () => {
    const stamp = STAMPED_PROPERTIES.find((p) => p.name === INTERNAL_PROPERTY);
    expect(stamp, "STAMPED_PROPERTIES has no internal row").toBeDefined();
    expect(stamp).toMatchObject({ destination: "posthog-browser", name: "internal", value: true, status: "new" });
    const { calls, target } = recorder();
    applyInternalFlag(target, "?internal=1");
    expect(calls).toEqual([`register ${JSON.stringify({ [stamp!.name]: stamp!.value })}`]);
  });
});
