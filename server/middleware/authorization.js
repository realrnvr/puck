import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ statusCode: 403, message: "Forbidden" });
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    return res.json({ statusCode: 403, message: "Forbidden" });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (error) {
    return res.json({ statusCode: 403, message: "Forbidden" });
  }
};
