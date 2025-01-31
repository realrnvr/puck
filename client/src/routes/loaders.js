import { queryClient } from "../services/provider/QueryClient/config/client";
import {
  fetchAuthor,
  fetchMangaCover,
  fetchStatics,
} from "../services/query/query";

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
    queryKey: ["coverImg", { mangaId, volume: "desc", width: 256 }],
    queryFn: () => fetchMangaCover({ mangaId, volume: "desc", width: 256 }),
  });

  return { mangaId, authorId };
};
