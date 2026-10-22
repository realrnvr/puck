import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.js";
import { redisClient } from "../../config/redisClient.js";

const app = createApp();

describe("search", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a missing query", async () => {
    const response = await request(app).get("/api/v1/manga/search");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Query must be a string.",
      type: "query",
    });
  });

  it("rejects an empty query", async () => {
    const response = await request(app)
      .get("/api/v1/manga/search")
      .query({ query: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Query cannot be empty.",
      type: "query",
    });
  });

  it("rejects a non-string query", async () => {
    const response = await request(app).get(
      "/api/v1/manga/search?query=berserk&query=vagabond",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Query must be a string.",
      type: "query",
    });
  });

  it("rejects an overlong query", async () => {
    const response = await request(app)
      .get("/api/v1/manga/search")
      .query({ query: "a".repeat(101) });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Query cannot exceed 100 characters.",
      type: "query",
    });
  });

  it("returns cached results for a valid query", async () => {
    const cached = { manga: [{ title: "Berserk" }] };
    vi.mocked(redisClient.get).mockResolvedValueOnce(JSON.stringify(cached));

    const response = await request(app)
      .get("/api/v1/manga/search")
      .query({ query: "  berserk  " });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(cached);
    expect(redisClient.get).toHaveBeenCalledWith("search:berserk");
  });
});
