import { describe, expect, it, vi } from "vitest";
import { parseDeviceHosts } from "../src/config.js";
import { apiUrl, replaceHostTokens, resolveHost } from "../src/hosts.js";
import { parseApiCommands } from "../src/logic.js";
import { getApiToken, setApiToken } from "../src/token.js";

// A value JSON can produce whose toString is not callable: String()
// and template interpolation throw on it.
const unstringifiable = { toString: [] };

describe("hosts with deformed command args", () => {
  it("reads an unstringifiable api arg as an empty segment instead of throwing", () => {
    expect(() => apiUrl(["cmd", unstringifiable])).not.toThrow();
    expect(apiUrl(["cmd", unstringifiable])).toBe("https://home.example/cmd/");
  });

  it("passes unstringifiable args through host token replacement untouched", () => {
    expect(replaceHostTokens([unstringifiable, "host:tv"])).toEqual([unstringifiable, "192.0.2.12"]);
  });

  it("does not resolve host or device names through the prototype chain", () => {
    expect(resolveHost("toString")).toBe("toString");
    expect(resolveHost("constructor")).toBe("constructor");
    expect(replaceHostTokens(["host:valueOf"])).toEqual(["valueOf"]);
    expect(replaceHostTokens(["device:toString"])).toEqual(["toString"]);
    expect(replaceHostTokens(["device:constructor"])).toEqual(["constructor"]);
  });
});

describe("config parsing with deformed values", () => {
  it.each([
    ["null", null],
    ["a number", 42],
    ["a json array", "[]"],
    ["a json string", '"str"'],
    ["an unstringifiable value", unstringifiable],
    ["broken json", "{nope"],
  ])("reads %s as an empty host map", (_, raw) => {
    expect(parseDeviceHosts(raw)).toEqual({});
  });

  it("keeps a well-formed host map", () => {
    expect(parseDeviceHosts('{"tv":"192.0.2.12"}')).toEqual({ tv: "192.0.2.12" });
  });
});

describe("data-api commands with deformed members", () => {
  it("passes null and object members through untouched", () => {
    expect(parseApiCommands('[["cmd",null]]')).toEqual([["cmd", null]]);
    expect(parseApiCommands('[["cmd",{"toString":[]}]]')).toEqual([["cmd", { toString: [] }]]);
  });

  it("keeps a batch of commands as a batch", () => {
    expect(parseApiCommands('[["a","1"],["b","2"]]')).toEqual([
      ["a", "1"],
      ["b", "2"],
    ]);
  });

  it("wraps a single flat command", () => {
    expect(parseApiCommands('["catt","stop"]')).toEqual([["catt", "stop"]]);
  });
});

describe("token storage with deformed values", () => {
  it("refuses an unstringifiable token without throwing", () => {
    const storage = { getItem: () => null, setItem: vi.fn(), removeItem: vi.fn() };
    expect(setApiToken(unstringifiable, storage)).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("reads the token as unset when storage throws", () => {
    const storage = {
      getItem: () => {
        throw new Error("denied");
      },
    };
    expect(getApiToken(storage)).toBeNull();
  });
});
