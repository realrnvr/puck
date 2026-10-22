import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends ContextErrorAPI {
  constructor(message: string, type: string | null = null) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.type = type;
  }
}
