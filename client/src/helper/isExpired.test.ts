import { describe, expect, it } from "vitest";
import { isExpired } from "./isExpired";

const encode = (value: object): string => {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const tokenWithPayload = (payload: object): string => {
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.signature`;
};

const tokenWithExp = (exp: number): string => tokenWithPayload({ exp });

describe("isExpired", () => {
  it("detects an expired token", () => {
    const exp = Math.floor(Date.now() / 1000) - 60;

    expect(isExpired(tokenWithExp(exp))).toBe(true);
  });

  it("accepts a token that has not expired", () => {
    const exp = Math.floor(Date.now() / 1000) + 60;

    expect(isExpired(tokenWithExp(exp))).toBe(false);
  });

  it("treats malformed tokens as expired", () => {
    expect(isExpired("not-a-token")).toBe(true);
  });

  it("preserves the non-expired result when exp is missing", () => {
    expect(isExpired(tokenWithPayload({}))).toBe(false);
  });
});
