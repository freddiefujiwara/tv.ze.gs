import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { parseDeviceHosts } from "../src/config.js";
import { apiUrl, replaceHostTokens, resolveHost } from "../src/hosts.js";
import { parseApiCommands } from "../src/logic.js";

// A value JSON can produce whose toString is not callable.
const unstringifiable = { toString: [] };

// Strings as they can arrive from the DOM / JSON: grapheme units only,
// because lone surrogates cannot appear in a parsed JSON payload.
const text = fc.string({ unit: "grapheme" });
const jsonValue = fc.jsonValue();

describe("hosts properties", () => {
  it("apiUrl joins string and number segments verbatim", () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(text, fc.integer())), (args) => {
        expect(apiUrl(args)).toBe(`https://home.example/${args.map(String).join("/")}`);
      }),
      { numRuns: 100 },
    );
  });

  it("apiUrl never throws on JSON-shaped args", () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(jsonValue, fc.constant(unstringifiable))), (args) => {
        expect(typeof apiUrl(args)).toBe("string");
      }),
      { numRuns: 100 },
    );
  });

  it("replaceHostTokens preserves the arg list shape and never throws", () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(text, fc.integer(), fc.constant(unstringifiable))), (args) => {
        const replaced = replaceHostTokens(args);
        expect(replaced).toHaveLength(args.length);
        replaced.forEach((arg, index) => {
          if (typeof args[index] !== "string" || !/^(host|device):/.test(args[index])) {
            expect(arg).toEqual(args[index]);
          }
        });
      }),
      { numRuns: 100 },
    );
  });

  it("resolveHost always returns a string for string input", () => {
    fc.assert(
      fc.property(text, (value) => {
        expect(typeof resolveHost(value)).toBe("string");
      }),
      { numRuns: 100 },
    );
  });
});

describe("data-api command properties", () => {
  it("parseApiCommands either throws its documented errors or returns an array of arrays", () => {
    fc.assert(
      fc.property(text, (payload) => {
        let commands;
        try {
          commands = parseApiCommands(payload);
        } catch {
          return; // invalid payloads throw by contract; the caller reports them
        }
        expect(Array.isArray(commands)).toBe(true);
        commands.forEach((command) => expect(Array.isArray(command)).toBe(true));
      }),
      { numRuns: 100 },
    );
  });
});

describe("config properties", () => {
  it("parseDeviceHosts never throws and only returns a plain object", () => {
    fc.assert(
      fc.property(fc.oneof(text, fc.anything()), (raw) => {
        const parsed = parseDeviceHosts(raw);
        expect(typeof parsed).toBe("object");
        expect(parsed).not.toBeNull();
        expect(Array.isArray(parsed)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
