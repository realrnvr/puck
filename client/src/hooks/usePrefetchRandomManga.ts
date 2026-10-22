import { fetchMangaCover, fetchRandomManga } from "../services/query/query";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage } from "../helper/getErrorMessage";

export const usePrefetchRandomManga = (LIMIT: number) => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    const randomMangaCache = queryClient.getQueryData([
      "random-manga",
      { LIMIT },
    ]);

    if (randomMangaCache) return;

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["random-manga", { LIMIT }],
        queryFn: () => fetchRandomManga(LIMIT),
      });

      response?.data?.manga?.forEach((val) => {
        queryClient.prefetchQuery({
          queryKey: [
            "manga-cover",
            { mangaId: val.mangaId, volume: "desc", width: 256 },
          ],
          queryFn: () =>
            fetchMangaCover({
              mangaId: val.mangaId,
              volume: "desc",
              width: 256,
            }),
        });
      });
    } catch (error) {
      const message = getErrorMessage(error);

      if (message) {
        toast.error(message);
      }
    }
  }, [queryClient, LIMIT]);

  return { prefetch };
};
