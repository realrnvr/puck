import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { fetchChapter, fetchChapterImage } from "../services/query/query";

const CHUNK_SIZE = 100;

export const useChapter = (mangaId) => {
  // state
  const [state, setState] = useLocalStorage(`mangaState:${mangaId}`, {
    chapterCount: 0,
    quality: "data",
    offset: 0,
  });

  // chapter data
  const {
    data: chapter,
    isLoading: isChapter,
    isError: isChapterError,
  } = useQuery({
    queryKey: ["chapter", { mangaId, CHUNK_SIZE, offset: state.offset }],
    queryFn: () => fetchChapter({ mangaId, CHUNK_SIZE, offset: state.offset }),
    placeholderData: keepPreviousData,
  });

  // data extraction
  const chapters = chapter?.data?.data;
  const totalChapters = chapter?.data?.total;
  const chapterBound = {
    first: chapter?.data?.chapterBound?.first || "-",
    last: chapter?.data?.chapterBound?.last || "-",
  };

  const chapterId = chapters && chapters[state.chapterCount]?.id;
  const currChapter =
    chapters && chapters[state.chapterCount]?.attributes?.chapter;
  const currVolume =
    chapters && chapters[state.chapterCount]?.attributes?.volume;

  // chapter limit
  const hasChapterPrev = state.chapterCount === 0;
  const hasChapterNext = state.chapterCount === chapters?.length - 1;

  // chapter images
  const {
    data,
    isLoading: isChapterImage,
    isError: isChapterImageError,
  } = useQuery({
    queryKey: ["chapter-image", { chapterId, quality: state.quality }],
    queryFn: () => fetchChapterImage({ chapterId, quality: state.quality }),
    placeholderData: keepPreviousData,
    enabled: !!chapterId,
  });

  // image array
  const slides = data?.data?.data || [];

  // memo chunk val
  const hasPrevChunk = useMemo(() => state.offset > 0, [state.offset]);
  const hasNextChunk = useMemo(
    () => state.offset + CHUNK_SIZE < totalChapters,
    [state.offset, totalChapters]
  );

  // handle chunk
  const handlePrevChunk = useCallback(() => {
    if (state.offset > 0) {
      setState((prev) => ({
        ...prev,
        offset: prev.offset - CHUNK_SIZE,
        chapterCount: 0,
      }));
    }
  }, [state.offset, setState]);

  const handleNextChunk = useCallback(() => {
    if (state.offset + CHUNK_SIZE < totalChapters) {
      setState((prev) => ({
        ...prev,
        offset: prev.offset + CHUNK_SIZE,
        chapterCount: 0,
      }));
    }
  }, [state.offset, totalChapters, setState]);

  // handle quality
  const handleQualityChange = useCallback(
    (e) => {
      const { value } = e.target;
      setState((prevState) => {
        return {
          ...prevState,
          quality: value,
        };
      });
    },
    [setState]
  );

  const prevChapter = useCallback(
    () =>
      setState((prevState) => {
        return {
          ...prevState,
          chapterCount: prevState.chapterCount - 1,
        };
      }),
    [setState]
  );

  const nextChapter = useCallback(
    () =>
      setState((prevState) => {
        return {
          ...prevState,
          chapterCount: prevState.chapterCount + 1,
        };
      }),
    [setState]
  );

  const setChapter = useCallback(
    (idx) =>
      setState((prevState) => {
        return {
          ...prevState,
          chapterCount: idx,
        };
      }),
    [setState]
  );

  return {
    chapter: {
      state,
      prevChapter,
      nextChapter,
      setChapter,
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
    isChapterImage,
    isChapter,
    isChapterError,
    isChapterImageError,
  };
};
