import { describe, expect, it } from "vitest";
import { REQUIRED_ENV, validateEnv } from "../../config/validateEnv.js";

describe("validateEnv", () => {
  it("throws when required variables are missing", () => {
    expect(() => validateEnv({})).toThrow(
      /Missing required environment variables/,
    );
  });

  it("accepts a complete environment", () => {
    const env = Object.fromEntries(
      REQUIRED_ENV.map((key) => [key, "test-value"]),
    );

    expect(() => validateEnv(env)).not.toThrow();
  });
});
