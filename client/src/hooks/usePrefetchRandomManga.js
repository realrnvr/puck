import { fetchMangaCover, fetchRandomManga } from "../services/query/query";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePrefetchRandomManga = (LIMIT) => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
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
      toast.error(error?.response?.data?.message);
    }
  }, [queryClient, LIMIT]);

  return { prefetch };
};
