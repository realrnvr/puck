import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { fetchFavourite } from "../services/query/query";
import {
  addFavourite,
  removeFavourite,
} from "../services/mutation/clientMutation";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

const LIMIT = Number(import.meta.env.VITE_ALL_FAVOURITE_LIMIT) || 6;

export const useFavourite = ({ mangaId, mangaData }) => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: Favourite, isLoading } = useQuery({
    queryKey: ["isFavourite", { mangaId }],
    queryFn: () => fetchFavourite({ mangaId }),
    enabled: !!auth.token,
  });

  const isFavourite = Favourite?.data?.isFavourite;

  const { mutate: add } = useMutation({
    mutationFn: () => addFavourite(mangaData),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFavourite", { mangaId }],
      });

      const previousIsFavourite = queryClient.getQueryData([
        "isFavourite",
        { mangaId },
      ]);

      // Update isFavourite state
      queryClient.setQueryData(["isFavourite", { mangaId }], (old) => {
        return {
          ...old,
          data: { isFavourite: true },
        };
      });

      return {
        previousIsFavourite,
      };
    },

    onError: (err, newFavourite, context) => {
      if (context?.previousIsFavourite) {
        queryClient.setQueryData(
          ["isFavourite", { mangaId }],
          context.previousIsFavourite
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isFavourite", { mangaId }] });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: () => removeFavourite(mangaId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFavourite", { mangaId }],
      });
      await queryClient.cancelQueries({
        queryKey: ["all-favourites", { LIMIT }],
      });

      const previousIsFavourite = queryClient.getQueryData([
        "isFavourite",
        { mangaId },
      ]);
      const previousAllFavourite = queryClient.getQueryData([
        "all-favourites",
        { LIMIT },
      ]);

      // Update isFavourite state
      queryClient.setQueryData(["isFavourite", { mangaId }], (old) => {
        return {
          ...old,
          data: { isFavourite: false },
        };
      });

      // Update all-favourites while maintaining structure
      if (previousAllFavourite) {
        queryClient.setQueryData(["all-favourites", { LIMIT }], (old) => {
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                client: page.client.filter((val) => {
                  return val.mangaId !== mangaId;
                }),
              };
            }),
          };
        });
      }

      return {
        previousIsFavourite,
        previousAllFavourite,
      };
    },

    onError: (err, newFavourite, context) => {
      if (context?.previousIsFavourite) {
        queryClient.setQueryData(
          ["isFavourite", { mangaId }],
          context.previousIsFavourite
        );
      }
      if (context?.previousAllFavourite) {
        queryClient.setQueryData(
          ["all-favourites", { LIMIT }],
          context.previousAllFavourite
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isFavourite", { mangaId }] });
      if (queryClient.getQueryData(["all-favourites", { LIMIT }])) {
        queryClient.invalidateQueries({
          queryKey: ["all-favourites", { LIMIT }],
        });
      }
    },
  });

  const handleFavourite = useCallback(() => {
    startTransition(() => {
      if (auth.token) {
        isFavourite ? remove() : add();
      }
    });
  }, [isFavourite, add, auth.token, remove]);

  const handleUserCheck = useCallback(() => {
    if (auth.user) return;

    toast("Please login!", { duration: 3000 });
  }, [auth.user]);

  return {
    isFavourite,
    isPending,
    isLoading,
    handleFavourite,
    handleUserCheck,
  };
};
