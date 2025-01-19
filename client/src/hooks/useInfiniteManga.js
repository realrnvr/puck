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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["mangas"],
      queryFn: fetchMangas,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return { data, isFetching, isFetchingNextPage, ref };
};
