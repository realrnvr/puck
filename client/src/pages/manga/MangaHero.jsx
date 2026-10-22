import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import MangaFsImg from "../../components/MangaFsImg";
import ErrorComp from "../../utils/errorComp/ErrorComp";

const MangaHero = ({
  view,
  isCover,
  isCoverError,
  isStatics,
  isStaticsError,
  isAuthor,
  isAuthorError,
}) => {
  return (
    <div className="manga__top-container">
      <div
        className={`manga__cover-wrapper ${
          isCoverError ? "manga__cover-wrapper-disabled" : null
        }`}
        style={{ pointerEvents: isCover ? "none" : "auto" }}
      >
        <img
          className="manga__cover-img"
          src={!isCoverError ? view.coverUrl : "/1px.webp"}
          alt=""
        />
        {!isCoverError ? <MangaFsImg coverImgUrl={view.coverUrl} /> : null}
        {isCover ? (
          <div className="manga__skeleton">
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              width={"100%"}
            />
          </div>
        ) : null}
      </div>
      <div className="manga__div">
        <h2 className="manga__title">
          {view.title}
          {isStatics ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              width={"130px"}
            />
          ) : null}
          {isStaticsError ? <ErrorComp height="50px" width="130px" /> : null}
        </h2>
        <p className="manga__kin">
          {view.altTitleJa}
          {isStatics ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              width={"130px"}
            />
          ) : null}
          {isStaticsError ? (
            <ErrorComp
              height="30px"
              width="130px"
              className={"error-comp--mt-0_5"}
            />
          ) : null}
        </p>
        <p className="manga__kin">
          {isAuthor ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"100%"}
              width={"100%"}
            />
          ) : isAuthorError ? (
            <ErrorComp height={"30px"} width={"130px"} />
          ) : (
            <span className="manga__created-by">
              Created by {view.authorName || "---"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

MangaHero.propTypes = {
  view: PropTypes.shape({
    title: PropTypes.string,
    altTitleJa: PropTypes.string,
    authorName: PropTypes.string,
    coverUrl: PropTypes.string,
  }).isRequired,
  isCover: PropTypes.bool,
  isCoverError: PropTypes.bool,
  isStatics: PropTypes.bool,
  isStaticsError: PropTypes.bool,
  isAuthor: PropTypes.bool,
  isAuthorError: PropTypes.bool,
};

export default MangaHero;
