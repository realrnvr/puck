const cookieName = "refreshToken";

export const refreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(cookieName, refreshToken, {
    ...refreshTokenCookieOptions(),
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie(cookieName, refreshTokenCookieOptions());
};
