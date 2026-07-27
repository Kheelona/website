import { renderHook } from "@testing-library/react";
import { getStrictContext } from "./get-strict-context";

// TEST ONLY (no story): getStrictContext is a utility that returns a
// [Provider, useContext] pair, not a visual component — a Storybook story would
// be meaningless.
describe("getStrictContext", () => {
  it("returns a [Provider, useContext] pair", () => {
    const [Provider, useValue] = getStrictContext<number>("CountContext");
    expect(typeof Provider).toBe("function");
    expect(typeof useValue).toBe("function");
  });

  it("throws a named error when the hook is used outside its provider", () => {
    const [, useValue] = getStrictContext<number>("CountContext");
    expect(() => renderHook(() => useValue())).toThrow(
      "useContext must be used within CountContext",
    );
  });

  it("falls back to a generic name when none is given", () => {
    const [, useValue] = getStrictContext<number>();
    expect(() => renderHook(() => useValue())).toThrow(
      "useContext must be used within a Provider",
    );
  });

  it("resolves the provided value inside the provider", () => {
    const [Provider, useValue] = getStrictContext<number>("CountContext");
    const { result } = renderHook(() => useValue(), {
      wrapper: ({ children }) => <Provider value={42}>{children}</Provider>,
    });
    expect(result.current).toBe(42);
  });
});
