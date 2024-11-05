import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends ContextErrorAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
