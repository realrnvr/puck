import "./test.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Test = () => {
  return (
    <SkeletonTheme
      baseColor="#202020"
      highlightColor="#444"
      height={"100%"}
      direction="rtl"
      // enableAnimation={false}
      // customHighlightBackground="linear-gradient(90deg, var(--base-color) 50%, var(--highlight-color) 80%, var(--base-color) 60%)"
    >
      <div className="test">
        <div className="box">
          <Skeleton containerClassName="flex-1" />
        </div>
        <div className="circle">
          <Skeleton circle={true} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default Test;
