import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";
import { useMemo } from "react";

export const useMangaData = ({ mangaId, authorId }) => {
  const {
    data: statics,
    isPending: isStatics,
    isError: isStaticsError,
  } = useQuery({
    queryKey: ["static", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/statics/${mangaId}`),
  });

  const {
    data: authorData,
    isPending: isAuthor,
    isError: isAuthorError,
  } = useQuery({
    queryKey: ["author", { authorId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/author/${authorId}`),
  });

  const {
    data: coverImg,
    isPending: isCover,
    isError: isCoverError,
  } = useQuery({
    queryKey: ["coverImg", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
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
    authorData,
    isAuthor,
    isAuthorError,
    coverImg,
    isCover,
    isCoverError,
    manga,
    author,
    mangaData,
  };
};
