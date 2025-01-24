import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { fetchFavourite } from "../services/query/query";
import {
  addFavourite,
  removeFavourite,
} from "../services/mutation/clientMutation";
import { useCallback, useTransition } from "react";
import toast from "react-hot-toast";

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
      toast("Adding...", { duration: Infinity, id: "fav-add-toast" });
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
      toast.remove("fav-add-toast");
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: () => removeFavourite(mangaId),

    onMutate: async () => {
      toast("removing...", { duration: Infinity, id: "fav-remove-toast" });
      await queryClient.cancelQueries({
        queryKey: ["isFavourite", { mangaId }],
      });
      await queryClient.cancelQueries({ queryKey: ["all-favourites"] });

      const previousIsFavourite = queryClient.getQueryData([
        "isFavourite",
        { mangaId },
      ]);
      const previousAllFavourite = queryClient.getQueryData(["all-favourites"]);

      // Update isFavourite state
      queryClient.setQueryData(["isFavourite", { mangaId }], (old) => {
        return {
          ...old,
          data: { isFavourite: false },
        };
      });

      // Update all-favourites while maintaining structure
      if (previousAllFavourite) {
        queryClient.setQueryData(["all-favourites"], (old) => {
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
          ["all-favourites"],
          context.previousAllFavourite
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isFavourite", { mangaId }] });
      if (queryClient.getQueryData(["all-favourites"])) {
        queryClient.invalidateQueries({ queryKey: ["all-favourites"] });
      }
      toast.remove("fav-remove-toast");
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
