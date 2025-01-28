import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "../../../pages/viewer/viewer.css";
import "./viewer-skeleton.css";

const ViewerSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="viewer viewer-skeleton">
        <div className="viewer-skeleton__container viewer-skeleton__top-container">
          <div className="viewer-skeleton__counter">
            <Skeleton height={"100%"} />
          </div>
          <div className="viewer-skeleton__util-btn">
            <Skeleton height={"100%"} />
          </div>
        </div>
        <div className="viewer-skeleton__container viewer-skeleton__mid-container">
          <div className="viewer-skelton__nav-btn">
            <Skeleton height={"100%"} />
          </div>
          <div className="viewer-skelton__nav-btn">
            <Skeleton height={"100%"} />
          </div>
        </div>
        <div className="viewer-skeleton__bottom-container">
          <div className="viewer-skeleton__controller viewer-skeleton__controller--border">
            <Skeleton
              height={"100%"}
              className="viewer-skeleton__controller--border"
            />
          </div>
          <div className="viewer-skeleton__controller-close-btn">
            <Skeleton height={"100%"} width={"100%"} borderRadius={"50%"} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ViewerSkeleton;
