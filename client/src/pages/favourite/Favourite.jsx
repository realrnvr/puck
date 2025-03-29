import "./favourite.css";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { Fragment } from "react";
import { fetchFavourites } from "../../services/query/query";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/mangaCard/MangaCardSkeleton";
import Skeleton from "react-loading-skeleton";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";

const LIMIT = Number(import.meta.env.VITE_ALL_FAVOURITE_LIMIT) || 6;

const Favourite = () => {
  const { token } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
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

  return (
    <section className="favourite | container">
      <GoBackBtn />
      <h2 className="favourite__title favourite__title--mt">Favourites</h2>
      <div
        className={`mangas__container ${
          data?.pages?.[0]?.client?.length === 0 || isError
            ? "mangas__container--pd"
            : null
        }`}
      >
        {!isLoading && !isError ? (
          <AnimatePresence>
            {data?.pages?.map((page, idx) => (
              <Fragment key={idx}>
                {page?.client?.map((val) => (
                  <motion.div
                    key={val.mangaId}
                    layout
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: -50 }}
                    transition={{ type: "tween", stiffness: 100 }}
                  >
                    <MangaCard
                      title={val?.mangaTitle}
                      mangaId={val?.mangaId}
                      authorId={val?.authorId}
                    />
                  </motion.div>
                ))}
              </Fragment>
            ))}
          </AnimatePresence>
        ) : null}

        {isFetching && !isFetchingNextPage && !data?.pages?.[0] ? (
          <MangaCardSkeleton count={LIMIT} />
        ) : null}
        {!(data?.pageParams?.[0] === "") && !isFetching && !isError ? (
          <MangaCardSkeleton count={LIMIT} />
        ) : null}
      </div>

      {data?.pages?.[0].client.length && !isError ? (
        <div className="favourite__bottom-container">
          <button
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

      {!(data?.pageParams?.[0] === "") && !isError ? (
        <div className="favourite__bottom-container">
          <button className="favourite__load-more-btn favourite__load-more-btn--cs-bg">
            <Skeleton
              width={"100px"}
              height={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </button>
        </div>
      ) : null}

      {data?.pages?.[0]?.client?.length === 0 ? (
        <div className="favourite__null">
          <h4 className="favourite__null-title">NOTHING!</h4>
          <p className="favourite__null-description">
            Your favourite list is empty!
          </p>
          <img className="favourite__null-img" src="/no-fav.webp" alt="" />
        </div>
      ) : null}

      {isError ? (
        <div className="favourite__null">
          <h4 className="favourite__null-title">ERROR &#58;&#40;</h4>
          <p className="favourite__null-description">{error?.message}</p>
          <img className="favourite__null-img" src="/no-fav.webp" alt="" />
        </div>
      ) : null}
    </section>
  );
};

export default Favourite;
