import "../../../components/auth/login/login.css";
import "./login-skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LoginSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="login__form">
        <div className="login-skeleton__form">
          <Skeleton height={"100%"} width={"100%"} />
        </div>
        <div className="login-skeleton__btn">
          <Skeleton height={"35px"} width={"110px"} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default LoginSkeleton;
