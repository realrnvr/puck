import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchChapter, fetchChapterImage } from "../services/query/query";
import toast from "react-hot-toast";

const DEFAULT_MANGA_STATE = {
  chapterCount: 0,
  quality: "data",
  offset: 0,
};

export const readStoredMangaState = (mangaId) => {
  if (typeof localStorage === "undefined") {
    return { ...DEFAULT_MANGA_STATE };
  }

  try {
    const stored = localStorage.getItem(`mangaState:${mangaId}`);
    if (!stored) return { ...DEFAULT_MANGA_STATE };

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_MANGA_STATE };
    }

    return {
      chapterCount:
        Number.isInteger(parsed.chapterCount) && parsed.chapterCount >= 0
          ? parsed.chapterCount
          : DEFAULT_MANGA_STATE.chapterCount,
      quality:
        parsed.quality === "data-saver"
          ? "data-saver"
          : DEFAULT_MANGA_STATE.quality,
      offset:
        Number.isInteger(parsed.offset) && parsed.offset >= 0
          ? parsed.offset
          : DEFAULT_MANGA_STATE.offset,
    };
  } catch {
    return { ...DEFAULT_MANGA_STATE };
  }
};

export const usePrefetchChapter = ({ mangaId, CHUNK_SIZE }) => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(async () => {
    const storedState = readStoredMangaState(mangaId);
    const chapterCache = queryClient.getQueryData([
      "chapter",
      { mangaId, CHUNK_SIZE, offset: storedState.offset },
    ]);

    if (chapterCache) return;

    try {
      const chapterData = await queryClient.fetchQuery({
        queryKey: [
          "chapter",
          { mangaId, CHUNK_SIZE, offset: storedState.offset },
        ],
        queryFn: () =>
          fetchChapter({ mangaId, CHUNK_SIZE, offset: storedState.offset }),
      });

      const chapters = chapterData?.data?.data || [];

      let chapterIndex = storedState.chapterCount || 0;
      if (chapterIndex >= chapters.length) chapterIndex = 0;

      const firstChapterId = chapters[chapterIndex]?.id;

      if (firstChapterId) {
        queryClient.prefetchQuery({
          queryKey: [
            "chapter-image",
            { chapterId: firstChapterId, quality: storedState.quality },
          ],
          queryFn: () =>
            fetchChapterImage({
              chapterId: firstChapterId,
              quality: storedState.quality,
            }),
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load.");
    }
  }, [CHUNK_SIZE, mangaId, queryClient]);

  return { prefetch };
};
