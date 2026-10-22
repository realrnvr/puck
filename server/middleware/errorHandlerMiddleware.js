import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, req, res, _next) => {
  const errObj = {
    type: err.type || null,
    message: err.message || "Something went wrong. Please try again later.",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "ValidationError") {
    const firstError = Object.values(err.errors ?? {})[0];
    const path = firstError?.path;
    const isPasswordMinLength =
      path === "password" && firstError?.properties?.type === "minlength";

    errObj.type = ["email", "password", "username"].includes(path)
      ? path
      : "validation";
    errObj.message = isPasswordMinLength
      ? `Password must be greater than ${
          firstError.properties.minlength - 1
        } characters.`
      : firstError?.message || "Invalid request.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.code === 11000) {
    const fields = Object.keys(err.keyValue ?? {});
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
  } else if (err.name === "CastError") {
    errObj.type = "invalid-id";
    errObj.message = "Invalid identifier.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.name === "TokenExpiredError") {
    errObj.type = "jwt";
    errObj.message = "Link has been expired.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.name === "JsonWebTokenError") {
    errObj.type = "jwt";
    errObj.message = "Invalid Verification Token";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.response?.status && err.response.statusText) {
    errObj.type = "dex-api-error";
    errObj.message = err.response.statusText;
    errObj.statusCode = err.response.status;
  }

  if (errObj.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
    errObj.message = "Something went wrong. Please try again later.";
  }

  return res
    .status(errObj.statusCode)
    .json({ message: errObj.message, type: errObj.type });
};
