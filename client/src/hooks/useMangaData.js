import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchStatics,
  fetchAuthor,
  fetchMangaCover,
} from "../services/query/query";

export const useMangaData = ({ mangaId, authorId }) => {
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
      const state = queryClient.getQueryData([
        "manga-cover",
        { mangaId, volume: "desc", width: 256 },
      ]);
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

  const mangaData = useMemo(
    () => ({
      mangaTitle: statics?.data?.data?.attributes?.title?.en,
      mangaId: mangaId,
      authorId: authorId,
      coverUrl: coverImg?.data?.coverImgUrl,
    }),
    [
      statics?.data?.data?.attributes?.title?.en,
      mangaId,
      authorId,
      coverImg?.data?.coverImgUrl,
    ]
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
