import { useEffect } from "react";
import { fetchMangaCover, fetchRandomManga } from "../services/query/query";
import { useQueryClient } from "@tanstack/react-query";

export const usePrefetchSliderManga = ({ inView, LIMIT }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!inView) {
      return;
    }

    const prefetch = async () => {
      const response = await queryClient.fetchQuery({
        queryKey: ["random-manga-slider", { LIMIT }],
        queryFn: () => fetchRandomManga(LIMIT),
      });

      response?.data?.manga?.forEach((val) => {
        queryClient.prefetchQuery({
          queryKey: ["manga-cover-slider", { mangaId: val.mangaId }],
          queryFn: () =>
            fetchMangaCover({
              mangaId: val.mangaId,
            }),
        });
      });
    };

    prefetch();
  }, [inView, LIMIT, queryClient]);
};
