import { describe, expect, it } from "vitest";
import { getErrorResponseData } from "./getErrorResponseData";

describe("getErrorResponseData", () => {
  it("returns response data from an Axios-shaped error", () => {
    expect(
      getErrorResponseData<{ message: string }>({
        response: { data: { message: "Nope" } },
      }),
    ).toEqual({ message: "Nope" });
  });

  it("returns undefined when the error has no response body", () => {
    expect(getErrorResponseData(new Error("boom"))).toBeUndefined();
  });
});
