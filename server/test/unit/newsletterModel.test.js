import { describe, expect, it } from "vitest";
import Newsletter from "../../models/newsletter.js";

describe("Newsletter model", () => {
  it("uses a per-document subscriptionDate default", () => {
    const defaultValue =
      Newsletter.schema.path("subscriptionDate").defaultValue;

    expect(typeof defaultValue).toBe("function");
  });
});
