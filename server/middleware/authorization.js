import { StatusCodes } from "http-status-codes";
import { UnauthorziedError } from "../errors/unauthorizedError.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
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
    throw new UnauthorziedError("Authorization invalid.");
  }
};
