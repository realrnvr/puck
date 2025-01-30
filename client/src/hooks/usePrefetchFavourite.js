import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchFavourites } from "../services/query/query";
import { useAuth } from "./useAuth";

export const usePrefetchFavourite = (LIMIT) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    if (!token) {
      return;
    }

    await queryClient.prefetchInfiniteQuery({
      queryKey: ["all-favourites", { LIMIT }],
      queryFn: ({ pageParam = "" }) => fetchFavourites({ LIMIT, pageParam }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      pages: 1,
    });
  }, [queryClient, LIMIT, token]);

  return { prefetch };
};
