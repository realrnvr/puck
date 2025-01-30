import { queryClient } from "../services/provider/QueryClient/config/client";
import {
  fetchAuthor,
  fetchCoverImg,
  fetchStatics,
} from "../services/query/query";

export const mangaLoader = ({ params }) => {
  const { mangaId, authorId } = params;

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
