import { useEffect } from "react";
import { fetchRandomManga } from "../services/query/query";
import { useQueryClient } from "@tanstack/react-query";

export const usePrefetchSliderManga = ({ inView, LIMIT }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!inView) {
      return;
    }

    const prefetch = async () => {
      await queryClient.prefetchQuery({
        queryKey: ["random-manga-slider", { LIMIT }],
        queryFn: () => fetchRandomManga(LIMIT),
      });
    };

    prefetch();
  }, [inView, LIMIT, queryClient]);
};
