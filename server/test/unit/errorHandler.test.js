import { describe, expect, it, vi } from "vitest";
import { errorHandlerMiddleware } from "../../middleware/errorHandlerMiddleware.js";
import { BadRequestError } from "../../errors/badRequestError.js";

const createResponse = () => {
  const res = {};

  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);

  return res;
};

describe("errorHandlerMiddleware", () => {
  it("hides internal messages for unexpected 500s", () => {
    const res = createResponse();

    errorHandlerMiddleware(new Error("database password leaked"), {}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong. Please try again later.",
      type: null,
    });
  });

  it("normalizes cast errors", () => {
    const res = createResponse();

    errorHandlerMiddleware(
      { name: "CastError", message: "Cast to ObjectId failed" },
      {},
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid identifier.",
      type: "invalid-id",
    });
  });

  it("preserves explicit 4xx messages", () => {
    const res = createResponse();

    errorHandlerMiddleware(
      new BadRequestError("Query cannot be empty.", "query"),
      {},
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Query cannot be empty.",
      type: "query",
    });
  });

  it("maps duplicate keys without relying on errorResponse", () => {
    const res = createResponse();

    errorHandlerMiddleware(
      { code: 11000, keyValue: { email: "taken@example.com" } },
      {},
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "email already exists.",
      type: "email",
    });
  });

  it("reports the invalid field for model validation errors", () => {
    const res = createResponse();

    errorHandlerMiddleware(
      {
        name: "ValidationError",
        errors: {
          email: {
            path: "email",
            message: "please provide valid email",
            properties: { type: "user defined" },
          },
        },
      },
      {},
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "please provide valid email",
      type: "email",
    });
  });
});
