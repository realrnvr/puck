import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { fetchChapter, fetchChapterImage } from "../services/query/query";

export const usePrefetchChapter = ({ mangaId, CHUNK_SIZE }) => {
  const queryClient = useQueryClient();

  const stateKey = `mangaState:${mangaId}`;
  const storedState = JSON.parse(localStorage.getItem(stateKey)) || {
    chapterCount: 0,
    quality: "data",
    offset: 0,
  };

  const prefetch = useCallback(async () => {
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
  }, [
    CHUNK_SIZE,
    mangaId,
    queryClient,
    storedState.chapterCount,
    storedState.offset,
    storedState.quality,
  ]);

  return { prefetch };
};
