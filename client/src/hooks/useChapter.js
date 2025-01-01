import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

const CHUNK_SIZE = 100;

export const useChapter = (mangaId) => {
  // state
  const [chapterCount, setChapterCount] = useLocalStorage(
    `chapterCount:${mangaId}`,
    0
  );
  const [quality, setQuality] = useLocalStorage(`quality:${mangaId}`, "data");
  const [offset, setOffset] = useLocalStorage(`offset:${mangaId}`, 0);

  // chapter data
  const { data: chapter } = useQuery({
    queryKey: ["chapter", { mangaId, CHUNK_SIZE, offset }],
    queryFn: () =>
      axiosInstance.get(
        `/api/v1/manga/chapters/${mangaId}?limit=${CHUNK_SIZE}&offset=${offset}`
      ),
    placeholderData: keepPreviousData,
  });

  // data extraction
  const chapters = chapter?.data?.data;
  const totalChapters = chapter?.data?.total;
  const chapterBound = {
    first: chapter?.data?.chapterBound?.first,
    last: chapter?.data?.chapterBound?.last,
  };

  const chapterId = chapters && chapters[chapterCount]?.id;
  const currChapter = chapters && chapters[chapterCount]?.attributes?.chapter;
  const currVolume = chapters && chapters[chapterCount]?.attributes?.volume;

  // chapter limit
  const hasChapterPrev = chapterCount === 0;
  const hasChapterNext = chapterCount === chapters?.length - 1;

  // chapter images
  const { data, isLoading } = useQuery({
    queryKey: ["chapter-image", { chapterId, quality }],
    queryFn: () =>
      axiosInstance.get(`/api/v1/manga/chapter-image/${chapterId}`, {
        params: {
          quality: quality,
        },
      }),
    placeholderData: keepPreviousData,
    enabled: !!chapterId,
  });

  // image array
  const slides = isLoading ? [] : data?.data?.data;

  // memo chunk val
  const hasPrevChunk = useMemo(() => offset > 0, [offset]);
  const hasNextChunk = useMemo(
    () => offset + CHUNK_SIZE < totalChapters,
    [offset, totalChapters]
  );

  // handle chunk
  const handlePrevChunk = useCallback(() => {
    if (hasPrevChunk) {
      setOffset((prev) => prev - CHUNK_SIZE);
      setChapterCount(0);
    }
  }, [hasPrevChunk, setOffset, setChapterCount]);

  const handleNextChunk = useCallback(() => {
    if (hasNextChunk) {
      setOffset((prev) => prev + CHUNK_SIZE);
      setChapterCount(0);
    }
  }, [hasNextChunk, setOffset, setChapterCount]);

  // handle quality
  const handleQualityChange = useCallback(
    (e) => {
      const { value } = e.target;
      setQuality(value);
    },
    [setQuality]
  );

  return {
    chapter: {
      chapterCount,
      setChapterCount,
      quality,
      handleQualityChange,
      currChapter,
      currVolume,
      chapters,
      totalChapters,
      chapterBound,
      hasChapterPrev,
      hasChapterNext,
    },
    nav: {
      hasPrevChunk,
      handlePrevChunk,
      hasNextChunk,
      handleNextChunk,
    },
    slides,
    isLoading,
  };
};
