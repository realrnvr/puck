import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import AuthorDropDown from "../../components/AuthorDropDown";
import FavBtn from "../../components/ui/favBtn/FavBtn";
import Tag from "../../components/ui/tag/Tag";
import ErrorComp from "../../utils/errorComp/ErrorComp";
import Markdown from "../../utils/markdown/Markdown";

const MangaDetails = ({
  view,
  manga,
  mangaData,
  mangaId,
  author,
  isStatics,
  isStaticsError,
  isAuthor,
  isAuthorError,
  isBtnDisabled,
  onRead,
  onPrefetch,
}) => {
  return (
    <div className="manga__content">
      <div className="manga__content-wrapper | container">
        <div className="manga__tags">
          {isStatics ? (
            Array.from({ length: 20 }, (_, idx) => {
              return (
                <Skeleton
                  key={idx}
                  baseColor="#202020"
                  highlightColor="#444"
                  height={"100%"}
                  width={"100px"}
                />
              );
            })
          ) : (
            <>
              {!isStaticsError ? (
                <Tag clr={true} tag={view.demographic} />
              ) : null}
              {!isStaticsError ? (
                <Tag clr={true} tag={view.contentRating} />
              ) : null}
              {view.tags.map((val, idx) => {
                return <Tag key={idx} tag={val?.attributes?.name?.en} />;
              })}
            </>
          )}
          {isStaticsError ? (
            <ErrorComp height={"25px"} width={"100px"} count={20} />
          ) : null}
        </div>
        <div>
          <p className="manga__para">
            {isStatics ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"25px"}
                width={"200px"}
              />
            ) : isStaticsError ? (
              <ErrorComp height={"25px"} width={"150px"} />
            ) : (
              <span className="manga__publication">
                Publication: {view.publicationYear}, {view.publicationStatus}
              </span>
            )}
          </p>
        </div>
        <div className="manga__btn-container">
          <FavBtn
            mangaId={mangaId}
            mangaData={mangaData}
            className="manga__btn-fav"
            isDisabled={isBtnDisabled || isStatics || isAuthor}
          />
          <button
            className="manga__btn"
            onClick={onRead}
            disabled={isBtnDisabled || isStatics || isAuthor}
            onMouseEnter={onPrefetch}
            onTouchStart={onPrefetch}
          >
            Read
          </button>
        </div>
        <div className="manga__description-container">
          {isStatics ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"300px"}
              width={"100%"}
            />
          ) : isStaticsError ? (
            <ErrorComp height={"300px"} />
          ) : (
            <Markdown content={manga} />
          )}
        </div>
        <div className="manga__author-container">
          <p className="manga__sec-title">Author</p>
          {isAuthorError ? (
            <ErrorComp
              width="150px"
              height="25px"
              className={"error-comp--mt-0_5"}
            />
          ) : (
            <AuthorDropDown
              name={view.authorName}
              author={author}
              isAuthor={isAuthor}
            />
          )}
        </div>
        <div className="manga__read-or-buy">
          <p className="manga__sec-title">Read or Buy</p>
          <div className="manga__links">
            {isStatics ? (
              Array.from({ length: 5 }, (_, idx) => {
                return (
                  <Skeleton
                    key={idx}
                    baseColor="#202020"
                    highlightColor="#444"
                    width={"100px"}
                  />
                );
              })
            ) : (
              <>
                <a
                  className={`manga__link ${
                    isStaticsError ? "manga__link-disable" : null
                  }`}
                  href={view.links.raw}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official Raw
                </a>
                <a
                  className={`manga__link ${
                    isStaticsError ? "manga__link-disable" : null
                  }`}
                  href={view.links.engtl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official English
                </a>
                <a
                  className={`manga__link ${
                    isStaticsError ? "manga__link-disable" : null
                  }`}
                  href={view.links.amz}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Amazon
                </a>
                <a
                  className={`manga__link ${
                    isStaticsError ? "manga__link-disable" : null
                  }`}
                  href={view.links.ebj}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  eBookJapan
                </a>
                <a
                  className={`manga__link ${
                    isStaticsError ? "manga__link-disable" : null
                  }`}
                  href={view.links.cdj}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CDJapan
                </a>
              </>
            )}
          </div>
        </div>
        <div className="manga__title-container">
          <p className="manga__sec-title">Alternative Titles</p>
          <div className="manga__lang-container">
            {isStatics ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                width={"100%"}
                count={10}
              />
            ) : (
              view.altTitles.map((val, idx) => {
                return (
                  <p className="manga__lang" key={idx}>
                    {val}
                  </p>
                );
              })
            )}
            {isStaticsError ? <ErrorComp height={"20px"} count={10} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

MangaDetails.propTypes = {
  view: PropTypes.shape({
    authorName: PropTypes.string,
    publicationYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    publicationStatus: PropTypes.string,
    demographic: PropTypes.string,
    contentRating: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    links: PropTypes.object.isRequired,
    altTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  manga: PropTypes.string,
  mangaData: PropTypes.shape({
    mangaTitle: PropTypes.string,
    mangaId: PropTypes.string,
    authorId: PropTypes.string,
    coverUrl: PropTypes.string,
  }),
  mangaId: PropTypes.string.isRequired,
  author: PropTypes.string,
  isStatics: PropTypes.bool,
  isStaticsError: PropTypes.bool,
  isAuthor: PropTypes.bool,
  isAuthorError: PropTypes.bool,
  isBtnDisabled: PropTypes.bool,
  onRead: PropTypes.func.isRequired,
  onPrefetch: PropTypes.func.isRequired,
};

export default MangaDetails;
