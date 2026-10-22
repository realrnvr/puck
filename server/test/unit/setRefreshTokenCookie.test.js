import { describe, expect, it, vi } from "vitest";
import {
  clearRefreshTokenCookie,
  refreshTokenCookieOptions,
  setRefreshTokenCookie,
} from "../../helper/setRefreshTokenCookie.js";

const createResponse = () => ({
  cookie: vi.fn(),
  clearCookie: vi.fn(),
});

describe("refresh token cookies", () => {
  it("uses secure cookie defaults outside production", () => {
    expect(refreshTokenCookieOptions()).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
  });

  it("sets the refresh token with a max age", () => {
    const res = createResponse();

    setRefreshTokenCookie(res, "refresh-token");

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 604800000,
      }),
    );
  });

  it("clears the refresh token with the same options", () => {
    const res = createResponse();

    clearRefreshTokenCookie(res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      "refreshToken",
      refreshTokenCookieOptions(),
    );
  });
});
