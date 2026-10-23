import { useQueryClient } from "@tanstack/react-query";
import { fetchMangaCover, fetchMangas } from "../services/query/query";
import { useCallback } from "react";
import toast from "react-hot-toast";

export const usePrefetchInfiniteManga = (LIMIT) => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    const infiniteMangaCache = queryClient.getQueryData(["mangas", { LIMIT }]);

    if (infiniteMangaCache) return;

    try {
      const response = await queryClient.fetchInfiniteQuery({
        queryKey: ["mangas", { LIMIT }],
        queryFn: ({ pageParam = "" }) => fetchMangas({ LIMIT, pageParam }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        pages: 1,
      });

      response?.pages?.forEach((page) => {
        page?.manga?.forEach((val) => {
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
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [queryClient, LIMIT]);

  return { prefetch };
};
