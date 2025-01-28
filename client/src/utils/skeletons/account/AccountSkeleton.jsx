import "./account-skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const AccountSkeleton = () => {
  return (
    <SkeletonTheme
      width={"100%"}
      height={"100%"}
      baseColor="#202020"
      highlightColor="#444"
    >
      <section className="account-skeleton | container">
        <Skeleton
          height={"30px"}
          width={"80px"}
          baseColor="#202020"
          highlightColor="#444"
        />
        <h2 className="account-skeleton__title">
          <Skeleton />
        </h2>
        <div className="acount__content">
          <h2 className="account-skeleton__username">
            <Skeleton />
          </h2>
          <p className="account-skeleton__mail">
            <Skeleton />
          </p>
          <p className="account-skeleton__settings">
            <Skeleton />
          </p>
          <p className="account-skeleton__settings account-skeleton__settings--mt">
            <Skeleton />
          </p>
        </div>
        <p className="account-skeleton__btn">
          <Skeleton />
        </p>
      </section>
    </SkeletonTheme>
  );
};

export default AccountSkeleton;
