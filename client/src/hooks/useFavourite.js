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

      queryClient.setQueryData(["isFavourite", { mangaId }], (old) => ({
        ...old,
        data: { isFavourite: true },
      }));

      if (previousAllFavourite) {
        queryClient.setQueryData(["all-favourites", { LIMIT }], (old) => {
          let newPages = [...old.pages];

          newPages = newPages.map((page) => ({
            ...page,
            client: page.client.filter((manga) => manga.mangaId !== mangaId),
          }));

          let carryOver = mangaData;

          for (let i = 0; i < newPages.length; i++) {
            if (!carryOver) break;

            let newClient = [carryOver, ...newPages[i].client];

            if (newClient.length > LIMIT) {
              carryOver = newClient.pop();
            } else {
              carryOver = null;
            }

            newPages[i] = { ...newPages[i], client: newClient };
          }

          if (carryOver) {
            newPages.push({ client: [carryOver] });
          }

          return { ...old, pages: newPages };
        });
      }

      return { previousIsFavourite, previousAllFavourite };
    },

    onError: (err, newFavourite, context) => {
      if (context?.previousIsFavourite) {
        queryClient.setQueryData(
          ["isFavourite", { mangaId }],
          context.previousIsFavourite
        );
        toast.error(err?.response?.data?.message);
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
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: () => removeFavourite(mangaId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFavourite", { mangaId }],
      });

      const previousIsFavourite = queryClient.getQueryData([
        "isFavourite",
        { mangaId },
      ]);

      queryClient.setQueryData(["isFavourite", { mangaId }], (old) => {
        return {
          ...old,
          data: { isFavourite: false },
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
        toast.error(err?.response?.data?.message);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isFavourite", { mangaId }] });
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
