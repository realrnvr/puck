import { useQueries, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";

export const useSliderManga = () => {
  const { data, isLoading: isMangaLoading } = useQuery({
    queryKey: ["random-manga-slider"],
    queryFn: () => axiosInstance.get("/api/v1/manga/random-manga?limit=5"),
  });

  const mangaQueries = useQueries({
    queries:
      data?.data?.manga?.map((val) => ({
        queryKey: ["manga-cover-slider", { mangaId: val.mangaId }],
        queryFn: () =>
          axiosInstance.get(
            `/api/v1/manga/cover/${val.mangaId}?volume=asc&width=512`
          ),
      })) ?? [],
  });

  const isCoversLoading = mangaQueries.some((query) => query.isLoading);

  const slides = data?.data?.manga?.map((val, idx) => ({
    src: mangaQueries[idx]?.data?.data.coverImgUrl,
    ...val,
  }));

  return { slides, isCoversLoading, isMangaLoading };
};
