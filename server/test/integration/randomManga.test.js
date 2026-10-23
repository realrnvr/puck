import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.js";
import { redisClient } from "../../config/redisClient.js";
import Manga from "../../models/manga.js";

const app = createApp();

const createManga = (count = 8) =>
  Manga.create(
    Array.from({ length: count }, (_, index) => ({
      title: `Manga ${index + 1}`,
      mangaId: `manga-${index + 1}`,
      authorId: `author-${index + 1}`,
      description: `Description ${index + 1}`,
    })),
  );

describe("random manga", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it.each(["0", "51", "abc", "1.5", "-1"])(
    "rejects an invalid limit of %s",
    async (limit) => {
      const response = await request(app)
        .get("/api/v1/manga/random-manga")
        .query({ limit });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Limit must be an integer between 1 and 50.",
        type: "limit",
      });
      expect(redisClient.get).not.toHaveBeenCalled();
    },
  );

  it("rejects multiple limit values", async () => {
    const response = await request(app).get(
      "/api/v1/manga/random-manga?limit=1&limit=2",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Limit must be an integer between 1 and 50.",
      type: "limit",
    });
  });

  it("returns the default limit when none is provided", async () => {
    await createManga();

    const response = await request(app).get("/api/v1/manga/random-manga");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(6);
    expect(response.body.manga).toHaveLength(6);
    expect(response.headers["x-cache"]).toBe("MISS");
    expect(redisClient.setEx).toHaveBeenCalledWith(
      "randomManga:6",
      300,
      expect.any(String),
    );
  });

  it("returns cached manga for a valid limit", async () => {
    const cached = { manga: [{ title: "Berserk" }], length: 1 };
    vi.mocked(redisClient.get).mockResolvedValueOnce(JSON.stringify(cached));

    const response = await request(app)
      .get("/api/v1/manga/random-manga")
      .query({ limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(cached);
    expect(response.headers["x-cache"]).toBe("HIT");
    expect(redisClient.setEx).not.toHaveBeenCalled();
  });

  it("falls back to the database when the cache read fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await createManga();
    vi.mocked(redisClient.get).mockRejectedValueOnce(
      new Error("Redis unavailable"),
    );

    const response = await request(app)
      .get("/api/v1/manga/random-manga")
      .query({ limit: 3 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.headers["x-cache"]).toBe("MISS");
    expect(console.error).toHaveBeenCalledWith(
      "Unable to read the random manga cache:",
      expect.any(Error),
    );
  });

  it("returns the database result when the cache write fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await createManga();
    vi.mocked(redisClient.setEx).mockRejectedValueOnce(
      new Error("Redis unavailable"),
    );

    const response = await request(app)
      .get("/api/v1/manga/random-manga")
      .query({ limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.headers["x-cache"]).toBe("MISS");
    expect(console.error).toHaveBeenCalledWith(
      "Unable to write the random manga cache:",
      expect.any(Error),
    );
  });

  it("ignores a malformed cache entry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await createManga();
    vi.mocked(redisClient.get).mockResolvedValueOnce("{not valid json");

    const response = await request(app)
      .get("/api/v1/manga/random-manga")
      .query({ limit: 1 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.headers["x-cache"]).toBe("MISS");
  });
});
