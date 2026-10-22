import "./favourite.css";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { fetchFavourites } from "../../services/query/query";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/mangaCard/MangaCardSkeleton";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";

const LIMIT = Number(import.meta.env.VITE_ALL_FAVOURITE_LIMIT) || 6;

const Favourite = () => {
  const { token } = useAuth();
  const reduceMotion = useReducedMotion();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["all-favourites", { LIMIT }],
    queryFn: ({ pageParam = "" }) => fetchFavourites({ LIMIT, pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!token,
  });

  const favourites = data?.pages?.flatMap((page) => page?.client ?? []) ?? [];
  const hasFavourites = favourites.length > 0;
  const isEmpty = !isLoading && !isError && !hasFavourites;

  return (
    <section className="favourite | container">
      <GoBackBtn />
      <h2 className="favourite__title favourite__title--mt">Favourites</h2>
      <div
        className={`mangas__container ${
          isEmpty || isError ? "mangas__container--pd" : ""
        }`}
      >
        {!isLoading && !isError ? (
          <AnimatePresence>
            {favourites.map((val) => (
              <motion.div
                key={val.mangaId}
                layout
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "tween", stiffness: 100 }
                }
              >
                <MangaCard
                  title={val?.mangaTitle}
                  mangaId={val?.mangaId}
                  authorId={val?.authorId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : null}

        {isLoading ? <MangaCardSkeleton count={LIMIT} /> : null}
      </div>

      {hasFavourites && !isError ? (
        <div className="favourite__bottom-container">
          <button
            type="button"
            onClick={fetchNextPage}
            disabled={!hasNextPage || isFetchingNextPage}
            className="favourite__load-more-btn"
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
          </button>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="favourite__null" role="status">
          <h4 className="favourite__null-title">NOTHING!</h4>
          <p className="favourite__null-description">
            Your favourite list is empty!
          </p>
          <img className="favourite__null-img" src="/no-fav.webp" alt="" />
        </div>
      ) : null}

      {isError ? (
        <div className="favourite__null" role="alert">
          <h4 className="favourite__null-title">ERROR &#58;&#40;</h4>
          <p className="favourite__null-description">
            {error?.response?.data?.message ?? error?.message}
          </p>
          <img className="favourite__null-img" src="/no-fav.webp" alt="" />
        </div>
      ) : null}
    </section>
  );
};

export default Favourite;
