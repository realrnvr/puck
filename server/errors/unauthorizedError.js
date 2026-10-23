import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends ContextErrorAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
