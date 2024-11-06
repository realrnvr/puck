export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    SameSite: "Strict",
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
  });
};
