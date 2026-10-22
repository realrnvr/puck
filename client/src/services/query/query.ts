import type { AxiosResponse } from "axios";
import type {
  AuthorResponse,
  ChapterImagesResponse,
  ChaptersResponse,
  FavouriteStatusResponse,
  FavouritesPage,
  MangaCoverResponse,
  MangasPage,
  RandomMangaResponse,
  SearchResponse,
  StaticsResponse,
} from "../../types/api";
import { axiosInstance } from "../api/axios";
import { queryClient } from "../provider/QueryClient/config/client";

export const fetchRandomManga = (
  LIMIT: number,
): Promise<AxiosResponse<RandomMangaResponse>> => {
  return axiosInstance.get(`/api/v1/manga/random-manga?limit=${LIMIT}`);
};

interface CoverArgs {
  mangaId: string;
  volume?: string;
  width?: number;
}

export const fetchMangaCover = ({
  mangaId,
  volume = "asc",
  width = 512,
}: CoverArgs): Promise<AxiosResponse<MangaCoverResponse>> => {
  return axiosInstance.get(
    `/api/v1/manga/cover/${mangaId}?volume=${volume}&width=${width}`,
  );
};

interface MangasArgs {
  LIMIT: number;
  pageParam?: string;
}

export const fetchMangas = async ({
  LIMIT,
  pageParam = "",
}: MangasArgs): Promise<MangasPage> => {
  const { data } = await axiosInstance.get<MangasPage>(
    `/api/v1/manga/mangas?limit=${LIMIT}&cursor=${pageParam}`,
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

export const fetchStatics = ({
  mangaId,
}: {
  mangaId: string;
}): Promise<AxiosResponse<StaticsResponse>> => {
  return axiosInstance.get(`/api/v1/manga/statics/${mangaId}`);
};

export const fetchAuthor = ({
  authorId,
}: {
  authorId: string;
}): Promise<AxiosResponse<AuthorResponse>> => {
  return axiosInstance.get(`/api/v1/manga/author/${authorId}`);
};

interface ChapterArgs {
  mangaId: string;
  CHUNK_SIZE: number;
  offset: number;
}

export const fetchChapter = ({
  mangaId,
  CHUNK_SIZE,
  offset,
}: ChapterArgs): Promise<AxiosResponse<ChaptersResponse>> => {
  return axiosInstance.get(
    `/api/v1/manga/chapters/${mangaId}?limit=${CHUNK_SIZE}&offset=${offset}`,
  );
};

interface ChapterImageArgs {
  chapterId: string;
  quality: string;
}

export const fetchChapterImage = ({
  chapterId,
  quality,
}: ChapterImageArgs): Promise<AxiosResponse<ChapterImagesResponse>> => {
  return axiosInstance.get(`/api/v1/manga/chapter-image/${chapterId}`, {
    params: {
      quality,
    },
  });
};

interface FavouritesArgs {
  LIMIT: number;
  pageParam?: string;
}

export const fetchFavourites = async ({
  LIMIT,
  pageParam = "",
}: FavouritesArgs): Promise<FavouritesPage> => {
  const { data } = await axiosInstance.get<FavouritesPage>(
    `/api/v1/client/all-favourites?limit=${LIMIT}&cursor=${pageParam}`,
  );
  return data;
};

export const fetchFavourite = ({
  mangaId,
}: {
  mangaId: string;
}): Promise<AxiosResponse<FavouriteStatusResponse>> => {
  return axiosInstance.get(`/api/v1/client/favourite/${mangaId}`);
};

export const fetchSearch = ({
  query,
}: {
  query: string;
}): Promise<AxiosResponse<SearchResponse>> => {
  return axiosInstance.get(`/api/v1/manga/search?query=${query}`);
};
