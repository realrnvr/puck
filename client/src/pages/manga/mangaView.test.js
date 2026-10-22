import { describe, expect, it } from "vitest";
import { getMangaView, isDexApiError } from "./mangaView";

const statics = {
  data: {
    data: {
      attributes: {
        title: { en: "Berserk" },
        altTitleJa: "ベルセルク",
        year: 1989,
        status: "ongoing",
        publicationDemographic: "seinen",
        contentRating: "suggestive",
        tags: [{ attributes: { name: { en: "Action" } } }],
        links: { raw: "https://raw.example" },
        altTitles: ["Berserk"],
      },
    },
  },
};
const authorData = {
  data: { data: { attributes: { name: "Kentaro Miura" } } },
};
const coverImg = { data: { coverImgUrl: "/cover.webp" } };

describe("getMangaView", () => {
  it("shapes manga and author data for the page", () => {
    expect(getMangaView({ statics, authorData, coverImg })).toEqual({
      title: "Berserk",
      altTitleJa: "ベルセルク",
      authorName: "Kentaro Miura",
      coverUrl: "/cover.webp",
      publicationYear: 1989,
      publicationStatus: "ongoing",
      demographic: "seinen",
      contentRating: "suggestive",
      tags: [{ attributes: { name: { en: "Action" } } }],
      links: { raw: "https://raw.example" },
      altTitles: ["Berserk"],
    });
  });

  it("falls back for missing manga data", () => {
    expect(getMangaView()).toEqual({
      title: undefined,
      altTitleJa: undefined,
      authorName: undefined,
      coverUrl: undefined,
      publicationYear: "---",
      publicationStatus: "---",
      demographic: undefined,
      contentRating: undefined,
      tags: [],
      links: {},
      altTitles: [],
    });
  });
});

describe("isDexApiError", () => {
  it("detects MangaDex API errors", () => {
    expect(
      isDexApiError({ response: { data: { type: "dex-api-error" } } }),
    ).toBe(true);
    expect(isDexApiError({ response: { data: { type: "query" } } })).toBe(
      false,
    );
    expect(isDexApiError()).toBe(false);
  });
});
