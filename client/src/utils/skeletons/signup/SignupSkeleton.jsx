import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "../../../components/auth/signup/signup.css";
import "./signup-skeleton.css";

const SignupSkeleton = () => {
  return (
    <div>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="signup__form">
          {Array.from({ length: 3 }, (_, idx) => {
            return (
              <div key={idx} className="signup-skeleton__input">
                <Skeleton height={"100%"} width={"100%"} />
              </div>
            );
          })}
          <div className="signup__btn-wrapper">
            <div className="signup-skeleton__btn">
              <Skeleton height={"34.4px"} width={"100px"} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default SignupSkeleton;
