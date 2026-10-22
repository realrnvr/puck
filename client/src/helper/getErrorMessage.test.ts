import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./getErrorMessage";

const axiosErrorWith = (data: unknown): unknown => ({
  isAxiosError: true,
  response: { data },
});

describe("getErrorMessage", () => {
  it("returns an API error message", () => {
    expect(getErrorMessage(axiosErrorWith({ message: "Nope" }))).toBe("Nope");
  });

  it("returns the fallback for a non-string message", () => {
    expect(getErrorMessage(axiosErrorWith({ message: 500 }), "Failed")).toBe(
      "Failed",
    );
  });

  it("returns the fallback for a non-Axios error", () => {
    expect(getErrorMessage(new Error("boom"), "Failed")).toBe("Failed");
  });
});
