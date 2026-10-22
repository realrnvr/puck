import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../helper/getErrorMessage";
import { fetchChapter, fetchChapterImage } from "../services/query/query";
import type { MangaState } from "../types/manga";

const DEFAULT_MANGA_STATE: MangaState = {
  chapterCount: 0,
  quality: "data",
  offset: 0,
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

export const readStoredMangaState = (mangaId: string): MangaState => {
  if (typeof localStorage === "undefined") {
    return { ...DEFAULT_MANGA_STATE };
  }

  try {
    const stored = localStorage.getItem(`mangaState:${mangaId}`);
    if (!stored) return { ...DEFAULT_MANGA_STATE };

    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) {
      return { ...DEFAULT_MANGA_STATE };
    }

    return {
      chapterCount:
        typeof parsed.chapterCount === "number" &&
        Number.isInteger(parsed.chapterCount) &&
        parsed.chapterCount >= 0
          ? parsed.chapterCount
          : DEFAULT_MANGA_STATE.chapterCount,
      quality:
        parsed.quality === "data-saver"
          ? "data-saver"
          : DEFAULT_MANGA_STATE.quality,
      offset:
        typeof parsed.offset === "number" &&
        Number.isInteger(parsed.offset) &&
        parsed.offset >= 0
          ? parsed.offset
          : DEFAULT_MANGA_STATE.offset,
    };
  } catch {
    return { ...DEFAULT_MANGA_STATE };
  }
};

interface PrefetchChapterArgs {
  mangaId: string;
  CHUNK_SIZE: number;
}

export const usePrefetchChapter = ({
  mangaId,
  CHUNK_SIZE,
}: PrefetchChapterArgs) => {
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
      const message = getErrorMessage(error, "Failed to load.");

      if (message) {
        toast.error(message);
      }
    }
  }, [CHUNK_SIZE, mangaId, queryClient]);

  return { prefetch };
};
