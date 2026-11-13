import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const loadOpenAiPixel = vi.hoisted(() => vi.fn(async () => "loaded"));
const startOpenAiAttribution = vi.hoisted(() => vi.fn());
const shouldLoadOpenAiPixel = vi.hoisted(() => vi.fn());

vi.mock("@/lib/ads/openai-pixel", () => ({ loadOpenAiPixel, startOpenAiAttribution, shouldLoadOpenAiPixel }));

const { OpenAiPixel } = await import("./OpenAiPixel");

afterEach(() => {
  vi.clearAllMocks();
});

describe("OpenAiPixel", () => {
  it("renders nothing", () => {
    shouldLoadOpenAiPixel.mockReturnValue(false);
    const { container } = render(<OpenAiPixel />);
    expect(container).toBeEmptyDOMElement();
  });

  it("does nothing off the production hosts: no cookie work, no loader", () => {
    shouldLoadOpenAiPixel.mockReturnValue(false);
    render(<OpenAiPixel />);
    expect(shouldLoadOpenAiPixel).toHaveBeenCalledWith(window.location.hostname);
    expect(startOpenAiAttribution).not.toHaveBeenCalled();
    expect(loadOpenAiPixel).not.toHaveBeenCalled();
  });

  it("on a production host remembers the ad click and loads the pixel, the SDK waiting for idle", () => {
    shouldLoadOpenAiPixel.mockReturnValue(true);
    render(<OpenAiPixel />);
    expect(startOpenAiAttribution).toHaveBeenCalledTimes(1);
    expect(loadOpenAiPixel).toHaveBeenCalledTimes(1);
    const [options] = loadOpenAiPixel.mock.calls[0] as unknown as [{ schedule: (run: () => void) => void }];
    expect(typeof options.schedule).toBe("function");

    const idle = vi.fn((cb: () => void) => cb());
    vi.stubGlobal("requestIdleCallback", idle);
    const run = vi.fn();
    options.schedule(run);
    expect(idle).toHaveBeenCalledWith(run, { timeout: 2000 });
    expect(run).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
