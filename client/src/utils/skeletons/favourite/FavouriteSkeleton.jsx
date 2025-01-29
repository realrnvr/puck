import "./favourite-skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const FavouriteSkeleton = () => {
  return (
    <SkeletonTheme
      width={"100%"}
      height={"100%"}
      baseColor="#202020"
      highlightColor="#444"
    >
      <section className="favourite-skeleton | container">
        <div className="favourite-skeleton__back-btn">
          <Skeleton />
        </div>
        <div className="favourite-skeleton__title">
          <Skeleton />
        </div>
        <div className="favourite-skeleton__container">
          <Skeleton />
        </div>
      </section>
    </SkeletonTheme>
  );
};

export default FavouriteSkeleton;
