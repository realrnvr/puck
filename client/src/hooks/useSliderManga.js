import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchMangaCover, fetchRandomManga } from "../services/query/query";

const LIMIT = 5;

export const useSliderManga = () => {
  const {
    data,
    isLoading: isMangaLoading,
    isError,
  } = useQuery({
    queryKey: ["random-manga-slider"],
    queryFn: () => fetchRandomManga(LIMIT),
  });

  const mangaQueries = useQueries({
    queries:
      data?.data?.manga?.map((val) => ({
        queryKey: ["manga-cover-slider", { mangaId: val.mangaId }],
        queryFn: () => fetchMangaCover({ mangaId: val.mangaId }),
      })) ?? [],
  });

  const isCoversLoading = mangaQueries.some((query) => query.isLoading);
  const isLoading = isMangaLoading || isCoversLoading;

  const slides = data?.data?.manga?.map((val, idx) => ({
    src: mangaQueries[idx]?.data?.data.coverImgUrl || "/slider-error-img.webp",
    ...val,
  }));

  return { slides, isLoading, isError };
};
