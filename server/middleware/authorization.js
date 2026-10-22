import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [scheme, accessToken] = authHeader?.split(" ") ?? [];

  if (scheme !== "Bearer" || !accessToken) {
    return res.status(401).json({
      message: "Authentication required.",
      type: "unauthenticated",
    });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (!payload?.userId) {
      throw new Error("Invalid access token payload");
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token.",
      type: "unauthenticated",
    });
  }
};
