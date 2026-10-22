import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { AxiosResponse } from "axios";
import type { MangaCoverResponse } from "../types/api";
import type { MangaData } from "../types/manga";
import {
  fetchStatics,
  fetchAuthor,
  fetchMangaCover,
} from "../services/query/query";

interface MangaDataArgs {
  mangaId: string;
  authorId: string;
}

export const useMangaData = ({ mangaId, authorId }: MangaDataArgs) => {
  const queryClient = useQueryClient();

  const {
    data: statics,
    isPending: isStatics,
    isError: isStaticsError,
    error: staticsError,
  } = useQuery({
    queryKey: ["statics", { mangaId }],
    queryFn: () => fetchStatics({ mangaId }),
  });

  const {
    data: authorData,
    isPending: isAuthor,
    isError: isAuthorError,
    error: authorError,
  } = useQuery({
    queryKey: ["author", { authorId }],
    queryFn: () => fetchAuthor({ authorId }),
  });

  const {
    data: coverImg,
    isPending: isCover,
    isError: isCoverError,
  } = useQuery({
    queryKey: ["coverImg", { mangaId, volume: "desc", width: 256 }],
    queryFn: () => fetchMangaCover({ mangaId, volume: "desc", width: 256 }),
    initialData: () => {
      const state = queryClient.getQueryData<AxiosResponse<MangaCoverResponse>>(
        ["manga-cover", { mangaId, volume: "desc", width: 256 }],
      );
      return state;
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState([
        "manga-cover",
        { mangaId, volume: "desc", width: 256 },
      ])?.dataUpdatedAt;
    },
  });

  const manga = statics?.data?.data?.attributes?.description?.en;
  const author = authorData?.data?.data?.attributes?.biography?.en;

  const mangaData = useMemo<MangaData>(
    () => ({
      mangaTitle: statics?.data?.data?.attributes?.title?.en,
      mangaId,
      authorId,
      coverUrl: coverImg?.data?.coverImgUrl,
    }),
    [
      statics?.data?.data?.attributes?.title?.en,
      mangaId,
      authorId,
      coverImg?.data?.coverImgUrl,
    ],
  );

  return {
    statics,
    isStatics,
    isStaticsError,
    staticsError,
    authorData,
    isAuthor,
    isAuthorError,
    authorError,
    coverImg,
    isCover,
    isCoverError,
    manga,
    author,
    mangaData,
  };
};
