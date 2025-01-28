import "../../../pages/manga/manga.css";
import "./manga-skeleton.css";
import Skeleton from "react-loading-skeleton";

const MangaSkeleton = () => {
  return (
    <article className="manga">
      <div className="manga__bg">
        <img className="manga__bg-img" src={"/1px.webp"} alt="" />
      </div>
      <div className="manga__wrapper | container">
        <Skeleton
          baseColor="#202020"
          highlightColor="#444"
          height={"30px"}
          width={"80px"}
        />
        <div className="manga__top-container">
          <div className="manga-skeleton__top-content">
            <img className="manga__cover-img" src={"/1px.webp"} alt="" />
            <div className="manga-skeleton__img">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"100%"}
              />
            </div>
          </div>
          <div className="manga__div">
            <h2 className="manga__title">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"130px"}
              />
            </h2>
            <p className="manga__kin">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"100%"}
              />
            </p>
            <p className="manga__kin">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"100%"}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="manga__content">
        <div className="manga__content-wrapper | container">
          <div className="manga__tags">
            {Array.from({ length: 20 }, (_, idx) => {
              return (
                <Skeleton
                  key={idx}
                  baseColor="#202020"
                  highlightColor="#444"
                  height={"100%"}
                  width={"100px"}
                />
              );
            })}
          </div>
          <div>
            <p className="manga__para">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"25px"}
                width={"200px"}
              />
            </p>
          </div>
          <div className="manga__btn-container">
            <div className="manga-skeleton__fav-btn">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"40px"}
                width={"40px"}
              />
            </div>
            <div className="manga-skeleton__btn">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"40px"}
                width={"200px"}
              />
            </div>
          </div>
          <div className="manga__description-container">
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"300px"}
              width={"100%"}
            />
          </div>
          <div className="manga__author-container">
            <p className="manga__sec-title">Author</p>
            <div className="manga-skeleton__author-btn">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"30px"}
                width={"150px"}
              />
            </div>
          </div>
          <div className="manga__read-or-buy">
            <p className="manga__sec-title">Read or Buy</p>
            <div className="manga__links">
              {Array.from({ length: 5 }, (_, idx) => {
                return (
                  <Skeleton
                    key={idx}
                    baseColor="#202020"
                    highlightColor="#444"
                    width={"100px"}
                  />
                );
              })}
            </div>
          </div>
          <div className="manga__title-container">
            <p className="manga__sec-title">Alternative Titles</p>
            <div className="manga__lang-container">
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                width={"100%"}
                count={10}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MangaSkeleton;
