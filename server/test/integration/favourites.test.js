import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";
import Client from "../../models/client.js";
import { createUser } from "../helpers/auth.js";

const app = createApp();

const authHeader = (user) => `Bearer ${user.createAccessToken()}`;

describe("all-favourites pagination", () => {
  it("returns an empty first page cleanly", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .get("/api/v1/client/all-favourites")
      .set("Authorization", authHeader(user));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ client: [], nextCursor: null, length: 0 });
  });

  it.each(["0", "51", "abc", "1.5", "-1"])(
    "rejects an invalid limit of %s",
    async (limit) => {
      const { user } = await createUser();

      const response = await request(app)
        .get("/api/v1/client/all-favourites")
        .query({ limit })
        .set("Authorization", authHeader(user));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Limit must be an integer between 1 and 50.",
        type: "limit",
      });
    },
  );

  it("rejects an invalid cursor", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .get("/api/v1/client/all-favourites")
      .query({ cursor: "not-an-object-id" })
      .set("Authorization", authHeader(user));

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid cursor.",
      type: "cursor",
    });
  });

  it("returns a stable nextCursor and the remaining page", async () => {
    const { user } = await createUser();
    const favourites = await Client.create([
      {
        mangaTitle: "Manga 1",
        mangaId: "manga-1",
        authorId: "author-1",
        createdBy: user._id,
      },
      {
        mangaTitle: "Manga 2",
        mangaId: "manga-2",
        authorId: "author-2",
        createdBy: user._id,
      },
      {
        mangaTitle: "Manga 3",
        mangaId: "manga-3",
        authorId: "author-3",
        createdBy: user._id,
      },
    ]);

    const firstPage = await request(app)
      .get("/api/v1/client/all-favourites")
      .query({ limit: 2 })
      .set("Authorization", authHeader(user));

    expect(firstPage.status).toBe(200);
    expect(firstPage.body.length).toBe(2);
    expect(firstPage.body.client.map((item) => item.mangaId)).toEqual([
      "manga-3",
      "manga-2",
    ]);
    expect(String(firstPage.body.nextCursor)).toBe(String(favourites[1]._id));

    const secondPage = await request(app)
      .get("/api/v1/client/all-favourites")
      .query({ limit: 2, cursor: firstPage.body.nextCursor })
      .set("Authorization", authHeader(user));

    expect(secondPage.status).toBe(200);
    expect(secondPage.body.length).toBe(1);
    expect(secondPage.body.client[0].mangaId).toBe("manga-1");
    expect(secondPage.body.nextCursor).toBeNull();
  });
});
