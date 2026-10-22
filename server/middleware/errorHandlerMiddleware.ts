import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";

interface ErrorDetail {
  path?: string;
  message?: string;
  properties?: {
    type?: string;
    minlength?: number;
  };
}

interface AppError {
  type?: string | null;
  message?: string;
  statusCode?: number;
  name?: string;
  code?: number | string;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, ErrorDetail>;
  response?: {
    status?: number;
    statusText?: string;
  };
}

export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const error = err as AppError;
  const errObj = {
    type: error.type || null,
    message: error.message || "Something went wrong. Please try again later.",
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors ?? {})[0];
    const path = firstError?.path;
    const isPasswordMinLength =
      path === "password" && firstError?.properties?.type === "minlength";

    errObj.type =
      path && ["email", "password", "username"].includes(path)
        ? path
        : "validation";
    errObj.message = isPasswordMinLength
      ? `Password must be greater than ${
          (firstError?.properties?.minlength ?? 0) - 1
        } characters.`
      : firstError?.message || "Invalid request.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (error.code === 11000) {
    const fields = Object.keys(error.keyValue ?? {});
    const field = fields.includes("username")
      ? "username"
      : fields.includes("email")
        ? "email"
        : null;

    errObj.type = field ?? "conflict";
    errObj.message = field
      ? `${field} already exists.`
      : "Resource already exists.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (error.name === "CastError") {
    errObj.type = "invalid-id";
    errObj.message = "Invalid identifier.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (error.name === "TokenExpiredError") {
    errObj.type = "jwt";
    errObj.message = "Link has been expired.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (error.name === "JsonWebTokenError") {
    errObj.type = "jwt";
    errObj.message = "Invalid Verification Token";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (error.response?.status && error.response.statusText) {
    errObj.type = "dex-api-error";
    errObj.message = error.response.statusText;
    errObj.statusCode = error.response.status;
  }

  if (errObj.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
    errObj.message = "Something went wrong. Please try again later.";
  }

  res
    .status(errObj.statusCode)
    .json({ message: errObj.message, type: errObj.type });
};
