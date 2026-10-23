import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { fetchMangas } from "../services/query/query";

export const useInfiniteManga = (LIMIT) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["mangas", { LIMIT }],
    queryFn: ({ pageParam = "" }) => fetchMangas({ LIMIT, pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isError) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage, isError]);

  return { data, isFetching, isFetchingNextPage, isError, ref };
};
