import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./account-setting-skeleton.css";

const AccountSettingSkeleton = () => {
  return (
    <SkeletonTheme
      width={"100%"}
      height={"100%"}
      baseColor="#202020"
      highlightColor="#444"
    >
      <section className="setting-skeleton | container">
        <div>
          <h2 className="setting-skeleton__title">
            <Skeleton />
          </h2>
          <div className="setting__option">
            <h3 className="setting-skeleton__sec-title">
              <Skeleton />
            </h3>
            <div>
              <div className="setting-skeleton__input">
                <Skeleton />
              </div>
              <p className="setting-skeleton__btn">
                <Skeleton />
              </p>
            </div>
          </div>
        </div>
        <div className="setting__bottom-container">
          <h2 className="setting-skeleton__sec-title">
            <Skeleton />
          </h2>
          <div className="setting__opt-container">
            <span className="setting-skeleton__label">
              <Skeleton />
            </span>
            <span className="setting-skeleton__label">
              <Skeleton />
            </span>
          </div>
          <div className="setting__opt-container">
            <span className="setting-skeleton__label">
              <Skeleton />
            </span>
            <span className="setting-skeleton__label">
              <Skeleton />
            </span>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );
};

export default AccountSettingSkeleton;
