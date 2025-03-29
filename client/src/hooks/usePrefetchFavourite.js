import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchFavourites, fetchMangaCover } from "../services/query/query";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const usePrefetchFavourite = (LIMIT) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    if (!token) {
      return;
    }

    const cachedFavourites = queryClient.getQueryData([
      "all-favourites",
      { LIMIT },
    ]);

    if (cachedFavourites) return;

    try {
      const response = await queryClient.fetchInfiniteQuery({
        queryKey: ["all-favourites", { LIMIT }],
        queryFn: ({ pageParam = "" }) => fetchFavourites({ LIMIT, pageParam }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        pages: 1,
      });

      response?.pages?.forEach((page) => {
        page?.client.forEach((val) => {
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
  }, [queryClient, LIMIT, token]);

  return { prefetch };
};
