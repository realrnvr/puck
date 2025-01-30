import { queryClient } from "../services/provider/QueryClient/config/client";
import {
  fetchAuthor,
  fetchCoverImg,
  fetchRandomManga,
  fetchStatics,
} from "../services/query/query";

const RANDOM_MANGA_LIMIT = Number(import.meta.env.VITE_RANDOM_MANGA_LIMIT) || 8;

export const mangaLoader = ({ params }) => {
  const { mangaId, authorId } = params;

  if (!mangaId || !authorId) {
    return null;
  }

  queryClient.prefetchQuery({
    queryKey: ["statics", { mangaId }],
    queryFn: () => fetchStatics({ mangaId }),
  });

  queryClient.prefetchQuery({
    queryKey: ["author", { authorId }],
    queryFn: () => fetchAuthor({ authorId }),
  });

  queryClient.prefetchQuery({
    queryKey: ["coverImg", { mangaId }],
    queryFn: () => fetchCoverImg({ mangaId }),
  });

  return { mangaId, authorId };
};

export const readLoader = () => {
  queryClient.prefetchQuery({
    queryKey: ["random-manga"],
    queryFn: () => fetchRandomManga(RANDOM_MANGA_LIMIT),
  });

  return null;
};
