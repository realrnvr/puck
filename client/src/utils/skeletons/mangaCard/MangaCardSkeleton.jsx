import "./manga-card-skeleton.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Fragment, memo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import PropTypes from "prop-types";

const MangaCardSkeleton = ({ count = 1 }) => {
  return Array.from({ length: count }, (_, idx) => {
    return (
      <Fragment key={idx}>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div className="manga-card__skeleton-container">
            <div className="manga-card__skeleton-btn">
              <Skeleton height={"100%"} />
            </div>
            <figure className="manga-card__skeleton">
              <div className="manga-card__skeleton-img">
                <Skeleton width={"100%"} height={"100%"} />
              </div>
              <img
                className="manga-card__img"
                style={{ visibility: "hidden" }}
                src="/1px.webp"
              />
              <div className="manga-card__caption">
                <h2 className="manga-card__title">
                  <Skeleton
                    className="manga-card__title-skeleton"
                    direction="rtl"
                  />
                </h2>
              </div>
            </figure>
          </div>
        </SkeletonTheme>
      </Fragment>
    );
  });
};

MangaCardSkeleton.propTypes = {
  count: PropTypes.number,
};

export default memo(MangaCardSkeleton);
