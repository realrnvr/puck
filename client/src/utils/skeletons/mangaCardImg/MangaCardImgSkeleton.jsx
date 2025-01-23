import "./manga-card-img-skeleton.css";
import Skeleton from "react-loading-skeleton";

const MangaCardImgSkeleton = () => {
  return (
    <figure className="manga-card__img-skeleton-wrapper">
      <div className="manga-card__img-skeleton">
        <Skeleton
          width={"100%"}
          height={"100%"}
          baseColor="#202020"
          highlightColor="#444"
        />
      </div>
      <img
        className="manga-card__img"
        style={{ visibility: "hidden" }}
        src="/1px.webp"
      />
    </figure>
  );
};

export default MangaCardImgSkeleton;
