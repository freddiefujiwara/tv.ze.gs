import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ERROR_MESSAGES } from "../src/constants.js";
import { parseApiCommands } from "../src/logic.js";

describe("parseApiCommands", () => {
  it("returns empty list for missing payloads", () => {
    expect(parseApiCommands()).toEqual([]);
  });

  it("returns empty list for empty array payloads", () => {
    expect(parseApiCommands("[]")).toEqual([]);
  });

  it("logs and throws for invalid json payloads", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => parseApiCommands('["hue",]')).toThrow();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("logs and throws for non-array payloads", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => parseApiCommands('"invalid"')).toThrow(ERROR_MESSAGES.INVALID_DATA_API);
    expect(errorSpy).toHaveBeenCalledWith(ERROR_MESSAGES.INVALID_DATA_API, "invalid");
    errorSpy.mockRestore();
  });
});


describe("parseApiCommands error", () => {
  it("handles non-array results", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => parseApiCommands('{}')).toThrow(ERROR_MESSAGES.INVALID_DATA_API);
    errorSpy.mockRestore();
  });
});
