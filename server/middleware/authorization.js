import { ForbiddenError } from "../errors/forbiddenError.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ForbiddenError("Forbidden");
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    throw new ForbiddenError("Forbidden");
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
    throw new ForbiddenError("Forbidden");
  }
};
