export const setRefreshTokenCookie = (res, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie("refreshToken", refreshToken, cookieOptions);
};
