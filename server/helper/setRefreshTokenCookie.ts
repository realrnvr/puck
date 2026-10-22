import type { CookieOptions, Response } from "express";

const cookieName = "refreshToken";

export const refreshTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie(cookieName, refreshToken, {
    ...refreshTokenCookieOptions(),
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(cookieName, refreshTokenCookieOptions());
};
