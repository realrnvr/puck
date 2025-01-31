import "../../../pages/read/read.css";
import "./read-skeleton.css";
import MangaCardSkeleton from "../mangaCard/MangaCardSkeleton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ReadSkeleton = () => {
  return (
    <SkeletonTheme
      height={"100%"}
      width={"250px"}
      baseColor="#202020"
      highlightColor="#444"
    >
      <div className="read__manga | container">
        <div className="read__text-wrapper">
          <h3 className="read__manga-title">
            <Skeleton />
          </h3>
          <p className="read__link lg-screen read-skeleton__link">
            <Skeleton />
          </p>
        </div>
        <div className="read__manga-container">
          <MangaCardSkeleton count={8} />
        </div>
        <p className="read__link read__link--mt sm-screen read-skeleton__link">
          <Skeleton />
        </p>
      </div>
    </SkeletonTheme>
  );
};

export default ReadSkeleton;
