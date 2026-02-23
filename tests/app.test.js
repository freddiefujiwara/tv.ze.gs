import { beforeEach, describe, expect, it, vi } from "vitest";
import { wireEvents } from "../src/app.js";
import { buildAppDocument, flushPromises } from "./test-helpers.js";

describe("app wiring", () => {
  let fetcher;

  beforeEach(async () => {
    fetcher = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("OK"),
    });
  });

  it("initializes and wires inputs", async () => {
    const document = buildAppDocument();

    wireEvents(document, fetcher);

    const link = document.createElement("a");
    link.className = "control"; // Required by bindLinkClicks logic if I used it, wait I used a[data-api]
    link.dataset.api = '["switchbot-command", "-d", "ID", "-c", "turnOn"]';
    document.body.appendChild(link);

    // Re-wire because bindLinkClicks uses querySelectorAll at the time of call
    wireEvents(document, fetcher);

    link.dispatchEvent(new Event("click", { bubbles: true }));
    await flushPromises();

    expect(fetcher).toHaveBeenCalledWith("http://a.ze.gs/switchbot-command/-d/ID/-c/turnOn");
  });

  it("handles multiple commands with delay", async () => {
    vi.useFakeTimers();
    const document = buildAppDocument();
    wireEvents(document, fetcher);

    const link = document.createElement("a");
    link.dataset.api = '[["c1"], ["c2"]]';
    document.body.appendChild(link);
    wireEvents(document, fetcher);

    const promise = (async () => {
        link.dispatchEvent(new Event("click"));
    })();

    await vi.runAllTimersAsync();
    await promise;

    expect(fetcher).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("handles execution errors", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const failingFetcher = vi.fn().mockRejectedValue(new Error("Fail"));
    const document = buildAppDocument();
    wireEvents(document, failingFetcher);

    const link = document.createElement("a");
    link.dataset.api = '["cmd"]';
    document.body.appendChild(link);
    wireEvents(document, failingFetcher);

    link.dispatchEvent(new Event("click"));
    await flushPromises();

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("starts the app", async () => {
    const document = buildAppDocument();
    const { start } = await import("../src/app.js");
    start(document, fetcher);
    // Verified via wireEvents side effects if needed, but here we just check it doesn't crash
  });

  it("bootstraps browser", async () => {
    const document = buildAppDocument();
    const { bootstrapBrowser } = await import("../src/app.js");
    bootstrapBrowser(document, fetcher);
  });
});
