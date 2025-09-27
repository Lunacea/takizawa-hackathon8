import { describe, expect, it } from "bun:test";
import { hello } from "./hello";

describe("hello", () => {
  it("returns Hello, world! by default", () => {
    expect(hello()).toBe("Hello, world!");
  });

  it("greets the given name", () => {
    expect(hello("t-wada")).toBe("Hello, t-wada!");
  });
});
