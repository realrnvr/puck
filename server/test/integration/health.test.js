import mongoose from "mongoose";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

describe("test harness", () => {
  it("connects to the in-memory database", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("serves the health endpoint", async () => {
    const response = await request(createApp()).get("/api/v1/ping");

    expect(response.status).toBe(200);
    expect(response.text).toBe("PONG!");
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(createApp()).get("/api/v1/not-a-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Route does not exist.",
      type: "not-found",
    });
  });
});
