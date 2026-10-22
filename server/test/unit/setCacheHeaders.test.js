import { describe, expect, it, vi } from "vitest";
import { setCacheHeaders } from "../../helper/setCacheHeaders.js";

const createResponse = (initialContentType) => {
  const headers = {};

  if (initialContentType) {
    headers["Content-Type"] = initialContentType;
  }

  const res = {
    set: vi.fn((key, value) => {
      if (typeof key === "object") {
        Object.assign(headers, key);
      } else {
        headers[key] = value;
      }

      return res;
    }),
    get: vi.fn((key) => headers[key]),
  };

  return { res, headers };
};

describe("setCacheHeaders", () => {
  it("sets cache headers and a default content type", () => {
    const { res, headers } = createResponse();

    setCacheHeaders({ res, cacheStatus: "HIT", ttl: 60 });

    expect(headers).toMatchObject({
      "X-Cache": "HIT",
      "Cache-Control": "public, max-age=60, s-maxage=60",
      "Content-Type": "application/json",
    });
  });

  it("does not overwrite an existing content type", () => {
    const { res, headers } = createResponse("image/webp");

    setCacheHeaders({
      res,
      cacheStatus: "MISS",
      ttl: 30,
      cType: "text/html",
    });

    expect(headers["Content-Type"]).toBe("image/webp");
  });
});
