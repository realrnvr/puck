import "./manga.css";
import { axiosInstance } from "../../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import Tag from "../../components/ui/tag/Tag";
import FavBtn from "../../components/ui/favBtn/FavBtn";
import Skeleton from "react-loading-skeleton";
import AuthorDropDown from "../../components/AuthorDropDown";
import MangaFsImg from "../../components/MangaFsImg";
import Markdown from "../../utils/markdown/Markdown";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";

const Manga = () => {
  const { mangaId, authorId } = useParams();

  const { data: statics, isPending: isStatics } = useQuery({
    queryKey: ["static", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/statics/${mangaId}`),
  });

  const { data: authorData, isPending: isAuthor } = useQuery({
    queryKey: ["author", { authorId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/author/${authorId}`),
  });

  const { data: coverImg, isPending: isCover } = useQuery({
    queryKey: ["coverImg", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
  });

  const manga = statics?.data?.data?.attributes?.description?.en;
  const author = authorData?.data?.data?.attributes?.biography?.en;

  const mangaData = useMemo(
    () => ({
      mangaTitle: statics?.data?.data?.attributes?.title?.en,
      mangaId: mangaId,
      authorId: authorId,
      coverUrl: coverImg?.data?.coverImgUrl,
    }),
    [
      statics?.data?.data?.attributes?.title?.en,
      mangaId,
      authorId,
      coverImg?.data?.coverImgUrl,
    ]
  );

  return (
    <article className="manga" style={{ marginTop: "1.5rem" }}>
      <div className="manga__bg">
        <img
          className="manga__bg-img"
          src={coverImg?.data?.coverImgUrl || "/t-1px.webp"}
          alt=""
        />
      </div>
      <div className="manga__wrapper | container">
        <GoBackBtn />
        <div className="manga__top-container">
          <div
            className="manga__cover-wrapper"
            style={{ pointerEvents: isCover ? "none" : "auto" }}
          >
            <img
              className="manga__cover-img"
              src={coverImg?.data?.coverImgUrl || "/t-1px.webp"}
              alt=""
            />
            <MangaFsImg coverImgUrl={coverImg?.data?.coverImgUrl} />
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
            </h2>
            <p className="manga__author" style={{ marginBottom: "1rem" }}>
              {statics?.data?.data?.attributes?.altTitleJa}
              {isStatics ? (
                <Skeleton
                  baseColor="#202020"
                  highlightColor="#444"
                  height={"100%"}
                  width={"130px"}
                />
              ) : null}
            </p>
            <p className="manga__author" style={{ marginBottom: "1rem" }}>
              {isAuthor ? (
                <Skeleton
                  baseColor="#202020"
                  highlightColor="#444"
                  height={"100%"}
                  width={"100%"}
                />
              ) : (
                <span>
                  Created by {authorData?.data?.data?.attributes?.name}
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
                <Tag
                  clr={true}
                  tag={statics?.data?.data?.attributes?.publicationDemographic}
                />
                <Tag
                  clr={true}
                  tag={statics?.data?.data?.attributes?.contentRating}
                />
                {statics?.data?.data?.attributes?.tags.map((val, idx) => {
                  return <Tag key={idx} tag={val?.attributes?.name?.en} />;
                })}
              </>
            )}
          </div>
          <div>
            <p className="manga__para">
              {isStatics ? (
                <Skeleton
                  baseColor="#202020"
                  highlightColor="#444"
                  height={"100%"}
                  width={"150px"}
                />
              ) : (
                <span>
                  Publication: {statics?.data?.data?.attributes?.year},{" "}
                  {statics?.data?.data?.attributes?.status}
                </span>
              )}
            </p>
          </div>
          <div className="manga__btn-container">
            <FavBtn
              mangaId={mangaId}
              mangaData={mangaData}
              className="manga__btn-fav"
            />
            <Link to={`/viewer/${mangaId}`} className="manga__btn signup__btn">
              Read
            </Link>
          </div>
          <div className="manga__description-container">
            {isStatics ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"300px"}
                width={"100%"}
              />
            ) : (
              <Markdown content={manga} />
            )}
          </div>
          <div className="manga__author-container">
            <p className="manga__sec-title">Author</p>
            <AuthorDropDown
              name={authorData?.data?.data?.attributes?.name}
              author={author}
              isAuthor={isAuthor}
            />
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
                    className="manga__link"
                    href={statics?.data?.data?.attributes?.links?.raw}
                  >
                    Official Raw
                  </a>
                  <a
                    className="manga__link"
                    href={statics?.data?.data?.attributes?.links?.engtl}
                  >
                    Official English
                  </a>
                  <a
                    className="manga__link"
                    href={statics?.data?.data?.attributes?.links?.amz}
                  >
                    Amazon
                  </a>
                  <a
                    className="manga__link"
                    href={statics?.data?.data?.attributes?.links?.ebj}
                  >
                    eBookJapan
                  </a>
                  <a
                    className="manga__link"
                    href={statics?.data?.data?.attributes?.links?.cdj}
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
                  count={15}
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
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Manga;
