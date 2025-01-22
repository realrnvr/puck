import "./favourite.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { useAuth } from "../../hooks/useAuth";
import { Fragment } from "react";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/MangaCard/MangaCardSkeleton";

const LIMIT = 10;

const Favourite = () => {
  const { user } = useAuth();

  const fetchFavourites = async ({ pageParam = "" }) => {
    const { data } = await axiosInstance.get(
      `/api/v1/client/all-favourites?limit=${LIMIT}&cursor=${pageParam}`
    );
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["all-favourites"],
    queryFn: fetchFavourites,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!user,
  });

  console.log(data);

  return (
    <section className="favourite | container">
      <h2 className="favourite__title">Favourites</h2>
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
      {!data?.pages?.[0].client.length && !isPending ? (
        <p className="favourite__alt">Your favorites list is empty.</p>
      ) : null}
    </section>
  );
};

export default Favourite;
