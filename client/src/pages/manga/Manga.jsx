import "./manga.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMangaData } from "../../hooks/useMangaData";
import { usePrefetchChapter } from "../../hooks/usePrefetchChapter";
import Tag from "../../components/ui/tag/Tag";
import FavBtn from "../../components/ui/favBtn/FavBtn";
import Skeleton from "react-loading-skeleton";
import AuthorDropDown from "../../components/AuthorDropDown";
import MangaFsImg from "../../components/MangaFsImg";
import Markdown from "../../utils/markdown/Markdown";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";
import ErrorComp from "../../utils/errorComp/ErrorComp";

const CHUNK_SIZE = Number(import.meta.env.VITE_CHUNK_SIZE) || 100;

const Manga = () => {
  const { mangaId, authorId } = useLoaderData();
  const navigate = useNavigate();

  const {
    statics,
    isStatics,
    isStaticsError,
    staticsError,
    authorData,
    isAuthor,
    isAuthorError,
    authorError,
    coverImg,
    isCover,
    isCoverError,
    manga,
    author,
    mangaData,
  } = useMangaData({ mangaId, authorId });

  const { prefetch } = usePrefetchChapter({ mangaId, CHUNK_SIZE });

  const handleNavigateClick = () => {
    navigate(`/viewer/${mangaId}`);
  };

  const isBtnDisabled =
    staticsError?.response?.data?.type === "dex-api-error" ||
    authorError?.response?.data?.type === "dex-api-error";

  return (
    <article className="manga">
      <div className="manga__bg">
        <img
          className="manga__bg-img"
          src={!isCoverError ? coverImg?.data?.coverImgUrl : "/t-1px.webp"}
          alt=""
        />
      </div>
      <div className="manga__wrapper | container">
        <GoBackBtn />
        <div className="manga__top-container">
          <div
            className={`manga__cover-wrapper ${
              isCoverError ? "manga__cover-wrapper-disabled" : null
            }`}
            style={{ pointerEvents: isCover ? "none" : "auto" }}
          >
            <img
              className="manga__cover-img"
              src={!isCoverError ? coverImg?.data?.coverImgUrl : "/1px.webp"}
              alt=""
            />
            {!isCoverError ? (
              <MangaFsImg coverImgUrl={coverImg?.data?.coverImgUrl} />
            ) : null}
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
              {statics?.data?.data?.attributes?.title?.en}
              {isStatics ? (
                <Skeleton
                  baseColor="#202020"
                  highlightColor="#444"
                  height={"100%"}
                  width={"130px"}
                />
              ) : null}
              {isStaticsError ? (
                <ErrorComp height="50px" width="130px" />
              ) : null}
            </h2>
            <p className="manga__kin">
              {statics?.data?.data?.attributes?.altTitleJa}
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
                  Created by {authorData?.data?.data?.attributes?.name || "---"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
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
                  <Tag
                    clr={true}
                    tag={
                      statics?.data?.data?.attributes?.publicationDemographic
                    }
                  />
                ) : null}
                {!isStaticsError ? (
                  <Tag
                    clr={true}
                    tag={statics?.data?.data?.attributes?.contentRating}
                  />
                ) : null}
                {statics?.data?.data?.attributes?.tags.map((val, idx) => {
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
                  Publication: {statics?.data?.data?.attributes?.year || "---"},{" "}
                  {statics?.data?.data?.attributes?.status || "---"}
                </span>
              )}
            </p>
          </div>
          <div className="manga__btn-container" onMouseEnter={prefetch}>
            <FavBtn
              mangaId={mangaId}
              mangaData={mangaData}
              className="manga__btn-fav"
              isDisabled={isBtnDisabled || isStatics || isAuthor}
            />
            <button
              className="manga__btn"
              onClick={handleNavigateClick}
              disabled={isBtnDisabled || isStatics || isAuthor}
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
                name={authorData?.data?.data?.attributes?.name}
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
                    href={statics?.data?.data?.attributes?.links?.raw}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Raw
                  </a>
                  <a
                    className={`manga__link ${
                      isStaticsError ? "manga__link-disable" : null
                    }`}
                    href={statics?.data?.data?.attributes?.links?.engtl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official English
                  </a>
                  <a
                    className={`manga__link ${
                      isStaticsError ? "manga__link-disable" : null
                    }`}
                    href={statics?.data?.data?.attributes?.links?.amz}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Amazon
                  </a>
                  <a
                    className={`manga__link ${
                      isStaticsError ? "manga__link-disable" : null
                    }`}
                    href={statics?.data?.data?.attributes?.links?.ebj}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    eBookJapan
                  </a>
                  <a
                    className={`manga__link ${
                      isStaticsError ? "manga__link-disable" : null
                    }`}
                    href={statics?.data?.data?.attributes?.links?.cdj}
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
                statics?.data?.data?.attributes?.altTitles?.map((val, idx) => {
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
    </article>
  );
};

export default Manga;
