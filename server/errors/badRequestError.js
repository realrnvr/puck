import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

class BadRequestError extends ContextErrorAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
