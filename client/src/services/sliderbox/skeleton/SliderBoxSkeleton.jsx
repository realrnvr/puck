import "./slider-box-skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SliderBoxSkeleton = () => {
  return (
    <SkeletonTheme
      height={"100%"}
      width={"100%"}
      baseColor="#202020"
      highlightColor="#444"
    >
      <div className="slider-sk">
        <div className="slider-sk__top">
          <h2 className="slider-sk__title">
            <Skeleton />
          </h2>
          <div className="slider-sk__btn">
            <Skeleton />
          </div>
        </div>
        <div>
          <p className="slider-sk__description">
            <Skeleton />
          </p>
          <div className="slider-sk__box-container">
            <div className="slider-sk__box">
              <Skeleton />
            </div>
            <div className="slider-sk__box">
              <Skeleton />
            </div>
            <div className="slider-sk__box">
              <Skeleton />
            </div>
            <div className="slider-sk__box">
              <Skeleton />
            </div>
            <div className="slider-sk__box">
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SliderBoxSkeleton;
