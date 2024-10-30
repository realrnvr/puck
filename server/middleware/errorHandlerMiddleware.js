import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  let errObj = {
    message: err.message || "Something Went Wrong, Please try Again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // validation errors
  if (err.name === "ValidationError") {
    errObj.message = Object.values(err.errors)
      .map((errorObj) => {
        return errorObj.properties.type === "minlength"
          ? `Password must be greater than ${
              errorObj.properties.minlength - 1
            } characters.`
          : errorObj.message;
      })
      .join(", ");
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    errObj.message = err.errorResponse.errmsg.includes("username")
      ? "username already exists."
      : "email already exists.";
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  }

  // JWT errors
  if (err.name === "TokenExpiredError") {
    errObj.message = "Link has been expired.";
    errObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err.name === "JsonWebTokenError") {
    errObj.message = "Invalid Verification Token";
    errObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  res.status(errObj.statusCode).json({ message: errObj.message });
  // res.status(500).json({ err });
};

export default errorHandlerMiddleware;
