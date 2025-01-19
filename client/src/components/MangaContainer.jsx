import { Fragment } from "react";
import { useInfiniteManga } from "../hooks/useInfiniteManga";
import MangaCard from "./ui/mangaCard/MangaCard";
import Proptypes from "prop-types";
import MangaCardSkeleton from "../utils/skeletons/MangaCard/MangaCardSkeleton";

const LIMIT = 10;

const MangaContainer = () => {
  const { data, isFetching, isFetchingNextPage, ref } = useInfiniteManga(LIMIT);

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
