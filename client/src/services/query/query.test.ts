import type { AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FavouritesPage, MangasPage } from "../../types/api";
import { axiosInstance } from "../api/axios";
import { queryClient } from "../provider/QueryClient/config/client";
import { fetchFavourites, fetchMangas } from "./query";

vi.mock("../api/axios", () => ({
  axiosInstance: { get: vi.fn() },
}));

vi.mock("../provider/QueryClient/config/client", () => ({
  queryClient: { prefetchQuery: vi.fn() },
}));

const mockedGet = vi.mocked(axiosInstance.get);
const mockedPrefetch = vi.mocked(queryClient.prefetchQuery);

describe("query", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a manga page and prefetches each cover", async () => {
    const page: MangasPage = {
      manga: [
        {
          title: "Berserk",
          mangaId: "manga-1",
          authorId: "author-1",
        },
        {
          title: "Monster",
          mangaId: "manga-2",
          authorId: "author-2",
        },
      ],
      nextCursor: "next-cursor",
    };

    mockedGet.mockResolvedValue({
      data: page,
    } as AxiosResponse<MangasPage>);

    await expect(fetchMangas({ LIMIT: 2 })).resolves.toEqual(page);

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/v1/manga/mangas?limit=2&cursor=",
    );
    expect(mockedPrefetch).toHaveBeenCalledTimes(2);
    expect(mockedPrefetch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        queryKey: ["manga-cover", { mangaId: "manga-1" }],
      }),
    );
    expect(mockedPrefetch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        queryKey: ["manga-cover", { mangaId: "manga-2" }],
      }),
    );
  });

  it("returns the favourites page data", async () => {
    const page: FavouritesPage = {
      client: [
        {
          mangaTitle: "Berserk",
          mangaId: "manga-1",
          authorId: "author-1",
        },
      ],
      nextCursor: null,
      length: 1,
    };

    mockedGet.mockResolvedValue({
      data: page,
    } as AxiosResponse<FavouritesPage>);

    await expect(fetchFavourites({ LIMIT: 6 })).resolves.toEqual(page);
    expect(mockedGet).toHaveBeenCalledWith(
      "/api/v1/client/all-favourites?limit=6&cursor=",
    );
  });
});
