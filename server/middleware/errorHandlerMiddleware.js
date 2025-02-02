import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // base error

  console.log(err);

  let errObj = {
    type: null,
    message: err.message || "Something Went Wrong, Please try Again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // validation errors
  if (err.name === "ValidationError") {
    errObj.type = "password";
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
    if (err.errorResponse.errmsg.includes("username")) {
      errObj.type = "username";
      errObj.message = "username already exists.";
    } else {
      errObj.type = "email";
      errObj.message = "email already exists.";
    }
    errObj.statusCode = StatusCodes.BAD_REQUEST;
  }

  // JWT errors
  if (err.name === "TokenExpiredError") {
    errObj.type = "jwt";
    errObj.message = "Link has been expired.";
    errObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err.name === "JsonWebTokenError") {
    errObj.type = "jwt";
    errObj.message = "Invalid Verification Token";
    errObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // mangadex api error
  if (err.response && err.response.status && err.response.statusText) {
    errObj.type = "dex-api-error";
    errObj.message = err.response.statusText;
    errObj.statusCode = err.response.status;
  }

  res
    .status(errObj.statusCode)
    .json({ message: errObj.message, type: errObj.type });
  // res.status(500).json({ err });
};
