import "./favourite.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { Fragment } from "react";
import { fetchFavourites } from "../../services/query/query";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/MangaCard/MangaCardSkeleton";

const LIMIT = 6;

const Favourite = () => {
  const { user } = useAuth();
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
    queryKey: ["all-favourites"],
    queryFn: ({ pageParam = "" }) => fetchFavourites({ LIMIT, pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!user,
  });

  return (
    <section className="favourite | container">
      <h2 className="favourite__title">Favourites</h2>
      {!data?.pages?.[0].client.length && !isLoading && !isError ? (
        <div className="favourite__null">
          <h4 className="favourite__null-title">NOTHING!</h4>
          <p className="favourite__null-description">
            Your favourite list is empty!
          </p>
          <img className="favourite__null-img" src="/no-fav.webp" alt="" />
        </div>
      ) : (
        <div className="mangas__container">
          {data?.pages?.map((page, idx) => {
            return (
              <Fragment key={idx}>
                {page?.client?.map((val, idx) => {
                  return (
                    <MangaCard
                      key={idx}
                      img={val?.coverUrl}
                      title={val?.mangaTitle}
                      mangaId={val?.mangaId}
                      authorId={val?.authorId}
                    />
                  );
                })}
              </Fragment>
            );
          })}
          {isFetching && !isFetchingNextPage && !data?.pages?.[0] ? (
            <MangaCardSkeleton count={LIMIT} />
          ) : null}
        </div>
      )}
      {data?.pages?.[0].client.length ? (
        <div className="favourite__bottom-container">
          <button
            onClick={() => fetchNextPage()}
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
      {/* {!data?.pages?.[0].client.length && !isPending && !isError ? (
        <div className="favourite__null">
          <h4 className="favourite__null-title">NOTHING!</h4>
          <p className="favourite__null-description">
            Your favourite list is empty!
          </p>
          <img className="favourite__null-img" src="/no-fav.png" alt="" />
        </div>
      ) : null} */}
      {isError ? <p className="favourite__alt">{error?.message}</p> : null}
    </section>
  );
};

export default Favourite;
