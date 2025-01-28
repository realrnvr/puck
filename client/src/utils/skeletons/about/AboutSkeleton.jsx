import "./about-skeleton.css";
import "../../../pages/about/about.css";
import Skeleton from "react-loading-skeleton";

const AboutSkeleton = () => {
  return (
    <div className="about | container">
      <div>
        <h3 className="about__title">
          <Skeleton
            height={"100%"}
            width={"250px"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </h3>
        <p className="about__description about__description--mt">
          <Skeleton
            height={"25px"}
            width={"100%"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </p>
      </div>
      <div>
        <h3 className="about__title">
          <Skeleton
            height={"100%"}
            width={"250px"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </h3>
        <p className="about__description about__description--mt">
          <Skeleton
            height={"25px"}
            width={"100%"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </p>
      </div>
      <div>
        <h3 className="about__title">
          <Skeleton
            height={"100%"}
            width={"250px"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </h3>
        <div className="about__description-container">
          <p className="about__description about__description--mt">
            <Skeleton
              height={"100%"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
          <p className="about__description">
            <Skeleton
              height={"100%"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
          <p className="about__description">
            <Skeleton
              height={"100%"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
          <p className="about__description">
            <Skeleton
              height={"100%"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
        </div>
      </div>
      <div>
        <h3 className="about__title">
          <Skeleton
            height={"100%"}
            width={"250px"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </h3>
        <div className="about__description-container">
          <p className="about__description about__description--mt">
            <Skeleton
              height={"70px"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
          <p className="about__description">
            <Skeleton
              height={"70px"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
          <p className="about__description">
            <Skeleton
              height={"70px"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
        </div>
      </div>
      <div>
        <h3 className="about__title">
          <Skeleton
            height={"100%"}
            width={"250px"}
            baseColor="#202020"
            highlightColor="#444"
          />
        </h3>
        <div className="about__description-container">
          <p className="about__description about__description--mt">
            <Skeleton
              height={"25px"}
              width={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSkeleton;
