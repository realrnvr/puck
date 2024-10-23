import ContextErrorAPI from "./contextAPIError.js";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends ContextErrorAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
