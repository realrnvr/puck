import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

class UnauthorziedError extends ContextErrorAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorziedError;
