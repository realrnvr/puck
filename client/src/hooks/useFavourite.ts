import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../helper/getErrorMessage";
import {
  addFavourite,
  removeFavourite,
} from "../services/mutation/clientMutation";
import { fetchFavourite } from "../services/query/query";
import type {
  FavouriteManga,
  FavouriteStatusResponse,
  FavouritesCachePage,
} from "../types/api";
import { useAuth } from "./useAuth";

const LIMIT = Number(import.meta.env.VITE_ALL_FAVOURITE_LIMIT) || 6;

interface UseFavouriteArgs {
  mangaId: string;
  mangaData: FavouriteManga;
}

interface AddFavouriteContext {
  previousIsFavourite: AxiosResponse<FavouriteStatusResponse> | undefined;
  previousAllFavourite: InfiniteData<FavouritesCachePage> | undefined;
}

interface RemoveFavouriteContext {
  previousIsFavourite: AxiosResponse<FavouriteStatusResponse> | undefined;
}

export const useFavourite = ({ mangaId, mangaData }: UseFavouriteArgs) => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: favourite, isLoading } = useQuery({
    queryKey: ["isFavourite", { mangaId }],
    queryFn: () => fetchFavourite({ mangaId }),
    enabled: !!auth.token,
  });

  const isFavourite = favourite?.data?.isFavourite;

  const { mutate: add } = useMutation({
    mutationFn: () => addFavourite(mangaData),

    onMutate: async (): Promise<AddFavouriteContext> => {
      await queryClient.cancelQueries({
        queryKey: ["isFavourite", { mangaId }],
      });
      await queryClient.cancelQueries({
        queryKey: ["all-favourites", { LIMIT }],
      });

      const previousIsFavourite = queryClient.getQueryData<
        AxiosResponse<FavouriteStatusResponse>
      >(["isFavourite", { mangaId }]);

      const previousAllFavourite = queryClient.getQueryData<
        InfiniteData<FavouritesCachePage>
      >(["all-favourites", { LIMIT }]);

      queryClient.setQueryData<AxiosResponse<FavouriteStatusResponse>>(
        ["isFavourite", { mangaId }],
        (old) => ({
          ...(old as AxiosResponse<FavouriteStatusResponse>),
          data: { isFavourite: true },
        }),
      );

      if (previousAllFavourite) {
        queryClient.setQueryData<InfiniteData<FavouritesCachePage>>(
          ["all-favourites", { LIMIT }],
          (old) => {
            const current = old as InfiniteData<FavouritesCachePage>;
            let newPages = [...current.pages];

            newPages = newPages.map((page) => ({
              ...page,
              client: page.client.filter((manga) => manga.mangaId !== mangaId),
            }));

            let carryOver: FavouriteManga | null = mangaData;

            for (let index = 0; index < newPages.length; index++) {
              if (!carryOver) break;

              const newClient: FavouriteManga[] = [
                carryOver,
                ...newPages[index].client,
              ];

              if (newClient.length > LIMIT) {
                carryOver = newClient.pop() ?? null;
              } else {
                carryOver = null;
              }

              newPages[index] = { ...newPages[index], client: newClient };
            }

            if (carryOver) {
              newPages.push({ client: [carryOver] });
            }

            return { ...current, pages: newPages };
          },
        );
      }

      return { previousIsFavourite, previousAllFavourite };
    },

    onError: (_error, _newFavourite, context) => {
      if (context?.previousIsFavourite) {
        queryClient.setQueryData(
          ["isFavourite", { mangaId }],
          context.previousIsFavourite,
        );
        const message = getErrorMessage(_error);

        if (message) {
          toast.error(message);
        }
      }
      if (context?.previousAllFavourite) {
        queryClient.setQueryData(
          ["all-favourites", { LIMIT }],
          context.previousAllFavourite,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isFavourite", { mangaId }] });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: () => removeFavourite(mangaId),

    onMutate: async (): Promise<RemoveFavouriteContext> => {
      await queryClient.cancelQueries({
        queryKey: ["isFavourite", { mangaId }],
      });

      const previousIsFavourite = queryClient.getQueryData<
        AxiosResponse<FavouriteStatusResponse>
      >(["isFavourite", { mangaId }]);

      queryClient.setQueryData<AxiosResponse<FavouriteStatusResponse>>(
        ["isFavourite", { mangaId }],
        (old) => {
          return {
            ...(old as AxiosResponse<FavouriteStatusResponse>),
            data: { isFavourite: false },
          };
        },
      );

      return {
        previousIsFavourite,
      };
    },

    onError: (_error, _newFavourite, context) => {
      if (context?.previousIsFavourite) {
        queryClient.setQueryData(
          ["isFavourite", { mangaId }],
          context.previousIsFavourite,
        );
        const message = getErrorMessage(_error);

        if (message) {
          toast.error(message);
        }
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isFavourite", { mangaId }] });
    },
  });

  const handleFavourite = useCallback(() => {
    startTransition(() => {
      if (auth.token) {
        if (isFavourite) {
          remove();
        } else {
          add();
        }
      }
    });
  }, [isFavourite, add, auth.token, remove]);

  const handleUserCheck = useCallback(() => {
    if (auth.token) return;

    toast("Please login!", { duration: 3000 });
  }, [auth.token]);

  return {
    isFavourite,
    isPending,
    isLoading,
    handleFavourite,
    handleUserCheck,
  };
};
