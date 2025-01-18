import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../services/api/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import MangaCard from "./ui/mangaCard/MangaCard";
import Proptypes from "prop-types";
import MangaCardSkeleton from "../utils/skeletons/MangaCard/MangaCardSkeleton";

const LIMIT = 10;

const MangaContainer = () => {
  const fetchMangas = async ({ pageParam = "" }) => {
    const { data } = await axiosInstance.get(
      `/api/v1/manga/mangas?limit=${LIMIT}&cursor=${pageParam}`
    );
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["mangas"],
      queryFn: fetchMangas,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <div className="mangas__container">
        {data?.pages?.map((page, idx) => {
          return (
            <Fragment key={idx}>
              {page?.manga?.map((val) => {
                return (
                  <MangaCard
                    key={val?.mangaId}
                    title={val?.title}
                    mangaId={val?.mangaId}
                    authorId={val?.authorId}
                  />
                );
              })}
            </Fragment>
          );
        })}
        {isFetching && !isFetchingNextPage && (
          <MangaCardSkeleton count={LIMIT} />
        )}
      </div>
      <div ref={ref} className="mangas__visual"></div>
    </>
  );
};

MangaContainer.propTypes = {
  caseManga: Proptypes.array,
};

export default MangaContainer;
