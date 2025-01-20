import "./fav-btn.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/api/axios";
import { useTransition } from "react";
import { useAuth } from "../../../hooks/useAuth";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const FavBtn = ({ mangaId, mangaData, className = "" }) => {
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const { data: Favourite, isLoading } = useQuery({
    queryKey: ["isFavourite", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/client/favourite/${mangaId}`),
    enabled: !!auth.token,
  });

  const { mutate: add } = useMutation({
    mutationFn: () =>
      axiosInstance.post(`/api/v1/client/add-favourite`, mangaData),

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
    mutationFn: () =>
      axiosInstance.delete(`/api/v1/client/remove-favourite/${mangaId}`),

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
      console.log(previousAllFavourite);

      // Update isFavourite state
      queryClient.setQueryData(["isFavourite", { mangaId }], (old) => {
        return {
          ...old,
          data: { isFavourite: false },
        };
      });

      // Update all-favourites while maintaining structure
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
      queryClient.invalidateQueries({ queryKey: ["all-favourites"] });
      toast.remove("fav-remove-toast");
    },
  });

  const handleFavourite = () => {
    startTransition(() => {
      if (auth.token) {
        Favourite?.data?.isFavourite ? remove() : add();
      }
    });
  };

  const handleUserCheck = () => {
    if (auth.user) return;

    toast("Please login!", { duration: 3000 });
  };

  return (
    <button
      className={`fav-btn ${className} ${
        isLoading || isPending ? "fav-btn__disable" : null
      }`}
      onClick={(e) => {
        handleUserCheck();
        handleFavourite();
        e.stopPropagation();
      }}
      disabled={isLoading || isPending}
    >
      {Favourite?.data?.isFavourite ? (
        <svg
          fill="currentColor"
          viewBox="0 0 1024 1024"
          className="fav-btn__svg"
        >
          <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
      ) : (
        <svg
          fill="currentColor"
          viewBox="0 0 1024 1024"
          className="fav-btn__svg"
        >
          <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
        </svg>
      )}
    </button>
  );
};

FavBtn.propTypes = {
  mangaId: PropTypes.string,
  mangaData: PropTypes.object,
  className: PropTypes.string,
};

export default FavBtn;
