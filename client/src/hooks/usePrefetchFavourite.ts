import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../helper/getErrorMessage";
import { fetchFavourites, fetchMangaCover } from "../services/query/query";
import { useAuth } from "./useAuth";

export const usePrefetchFavourite = (LIMIT: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    if (!token) {
      return;
    }

    const favouriteCache = queryClient.getQueryData([
      "all-favourites",
      { LIMIT },
    ]);

    if (favouriteCache) return;

    try {
      const response = await queryClient.fetchInfiniteQuery({
        queryKey: ["all-favourites", { LIMIT }],
        queryFn: ({ pageParam = "" }) => fetchFavourites({ LIMIT, pageParam }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        pages: 1,
      });

      response.pages.forEach((page) => {
        page.client.forEach((val) => {
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
      const message = getErrorMessage(error);

      if (message) {
        toast.error(message);
      }
    }
  }, [queryClient, LIMIT, token]);

  return { prefetch };
};
