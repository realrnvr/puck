import { axiosInstance } from "../api/axios";
import { queryClient } from "../provider/QueryClient/config/client";

export const fetchRandomManga = async (LIMIT) => {
  const response = await axiosInstance.get(
    `/api/v1/manga/random-manga?limit=${LIMIT}`
  );

  return response;
};

export const fetchMangaCover = ({ mangaId, volume = "asc", width = 512 }) => {
  return axiosInstance.get(
    `/api/v1/manga/cover/${mangaId}?volume=${volume}&width=${width}`
  );
};

export const fetchMangas = async ({ LIMIT, pageParam = "" }) => {
  const { data } = await axiosInstance.get(
    `/api/v1/manga/mangas?limit=${LIMIT}&cursor=${pageParam}`
  );

  data?.manga.forEach((val) => {
    queryClient.prefetchQuery({
      queryKey: ["manga-cover", { mangaId: val.mangaId }],
      queryFn: () =>
        fetchMangaCover({ mangaId: val.mangaId, volume: "desc", width: 256 }),
    });
  });

  return data;
};

export const fetchStatics = ({ mangaId }) => {
  return axiosInstance.get(`/api/v1/manga/statics/${mangaId}`);
};

export const fetchAuthor = ({ authorId }) => {
  return axiosInstance.get(`/api/v1/manga/author/${authorId}`);
};

export const fetchChapter = ({ mangaId, CHUNK_SIZE, offset }) => {
  return axiosInstance.get(
    `/api/v1/manga/chapters/${mangaId}?limit=${CHUNK_SIZE}&offset=${offset}`
  );
};

export const fetchChapterImage = ({ chapterId, quality }) => {
  return axiosInstance.get(`/api/v1/manga/chapter-image/${chapterId}`, {
    params: {
      quality,
    },
  });
};

export const fetchFavourites = async ({ LIMIT, pageParam = "" }) => {
  const { data } = await axiosInstance.get(
    `/api/v1/client/all-favourites?limit=${LIMIT}&cursor=${pageParam}`
  );
  return data;
};

export const fetchFavourite = ({ mangaId }) => {
  return axiosInstance.get(`/api/v1/client/favourite/${mangaId}`);
};

export const fetchSearch = ({ query }) => {
  return axiosInstance.get(`/api/v1/manga/search?query=${query}`);
};
