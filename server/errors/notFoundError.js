import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends ContextErrorAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
