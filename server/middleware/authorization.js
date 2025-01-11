import { ForbiddenError } from "../errors/forbiddenError.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("authHeader error", authHeader);
    // throw new ForbiddenError("Forbidden");
    return res.json({ statusCode: 403, message: "Forbidden" });
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    console.log("accessToken error");
    // throw new ForbiddenError("Forbidden");
    return res.json({ statusCode: 403, message: "Forbidden" });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = {
      username: payload.username,
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (error) {
    console.log("payload error");
    // throw new ForbiddenError("Forbidden");
    return res.json({ statusCode: 403, message: "Forbidden" });
  }
};
