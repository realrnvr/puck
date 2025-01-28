import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./change-password-skeleton.css";

const ChangePasswordSkeleton = () => {
  return (
    <SkeletonTheme
      width={"100%"}
      height={"100%"}
      baseColor="#202020"
      highlightColor="#444"
    >
      <section className="change-skeleton | container">
        <Skeleton
          height={"30px"}
          width={"80px"}
          baseColor="#202020"
          highlightColor="#444"
        />
        <h2 className="change-skeleton__title">
          <Skeleton />
        </h2>
        <p className="change-skeleton__description">
          <Skeleton />
        </p>
        <p className="change-skeleton__description">
          <Skeleton />
        </p>
        <div>
          <div className="change-skeleton__input">
            <Skeleton />
          </div>
          <div className="change-skeleton__input">
            <Skeleton />
          </div>
          <div className="change-skeleton__input">
            <Skeleton />
          </div>
          <p className="change-skeleton__btn">
            <Skeleton />
          </p>
        </div>
      </section>
    </SkeletonTheme>
  );
};

export default ChangePasswordSkeleton;
