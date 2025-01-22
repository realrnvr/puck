import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export const useInfiniteManga = (LIMIT) => {
  const fetchMangas = async ({ pageParam = "" }) => {
    const { data } = await axiosInstance.get(
      `/api/v1/manga/mangas?limit=${LIMIT}&cursor=${pageParam}`
    );
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    queryKey: ["mangas"],
    queryFn: fetchMangas,
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
