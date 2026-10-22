import { describe, expect, it } from "vitest";
import { hasErrors } from "./hasErrors";

describe("hasErrors", () => {
  it("returns false for an empty error object", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("returns true when any field has an error", () => {
    expect(hasErrors({ email: "Valid email." })).toBe(true);
  });
});
