import { useQueryClient } from "@tanstack/react-query";
import { fetchMangas } from "../services/query/query";
import { useCallback } from "react";

export const usePrefetchInfiniteManga = (LIMIT) => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["mangas", { LIMIT }],
      queryFn: ({ pageParam = "" }) => fetchMangas({ LIMIT, pageParam }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      pages: 1,
    });
  }, [queryClient, LIMIT]);

  return { prefetch };
};
