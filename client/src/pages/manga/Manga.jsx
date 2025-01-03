import "./manga.css";
import { axiosInstance } from "../../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Tag from "../../components/ui/tag/Tag";
import FavBtn from "../../components/ui/favBtn/FavBtn";

const Manga = () => {
  const { mangaId, authorId } = useParams();
  const [drop, setDrop] = useState(false);

  const { data: statics } = useQuery({
    queryKey: ["static", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/statics/${mangaId}`),
  });

  const { data: authorData } = useQuery({
    queryKey: ["author", { authorId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/author/${authorId}`),
  });

  const { data: coverImg } = useQuery({
    queryKey: ["coverImg", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
  });

  const guts = statics?.data?.data?.attributes?.description?.en;
  const process = guts
    ?.replaceAll(" \n  \n", "<br/><br/>")
    ?.replaceAll("\n\n", "<br/><br/>")
    ?.replaceAll("***", "<strong>")
    ?.replaceAll("---", "<hr>");

  const author = authorData?.data?.data?.attributes?.biography?.en;
  const aprocess = author
    ?.replaceAll(" \n  \n", "<br/><br/>")
    ?.replaceAll("\n\n", "<br/><br/>")
    ?.replaceAll("***", "<strong>")
    ?.replaceAll("---", "<hr>");

  const mangaData = {
    mangaTitle: statics?.data?.data?.attributes?.title?.en,
    mangaId: mangaId,
    authorId: authorId,
    coverUrl: coverImg?.data?.coverImgUrl,
  };

  return (
    <article className="manga" style={{ marginTop: "3rem" }}>
      <div className="manga__bg">
        <img
          className="manga__bg-img"
          src={coverImg?.data?.coverImgUrl}
          alt=""
        />
      </div>
      <div className="manga__wrapper | container">
        <div className="manga__top-container">
          <div className="manga__cover-wrapper">
            <img
              className="manga__cover-img"
              src={coverImg?.data?.coverImgUrl}
              alt=""
            />
          </div>
          <div>
            <h2 className="manga__title">
              {statics?.data?.data?.attributes?.title?.en}
            </h2>
            <p className="manga__author" style={{ marginBottom: "1rem" }}>
              {statics?.data?.data?.attributes?.altTitles[4]?.ja}
            </p>
            <p className="manga__author" style={{ marginBottom: "1rem" }}>
              Created by {authorData?.data?.data?.attributes?.name}
            </p>
          </div>
        </div>
      </div>
      <div className="manga__content">
        <div className="manga__content-wrapper | container">
          <div className="manga__tags">
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
          </div>
          <div>
            <p className="manga__para">
              Publication: {statics?.data?.data?.attributes?.year},{" "}
              {statics?.data?.data?.attributes?.status}
            </p>
          </div>
          <div className="manga__btn-container">
            {/* button */}
            <FavBtn mangaId={mangaId} mangaData={mangaData} />
            {/* button */}
            <Link
              to={`/viewer/${mangaId}`}
              className="manga__btn manga__btn--flex-3 signup__btn"
            >
              Read
            </Link>
          </div>
          <div>
            <p
              className="manga__description"
              dangerouslySetInnerHTML={{ __html: process }}
            ></p>
          </div>
          <div className="manga__author-container">
            <p className="manga__sec-title">Author</p>
            <div className="manga__drop-down">
              <p className="manga__author manga__author-tag">
                {authorData?.data?.data?.attributes?.name}
              </p>
              <button
                className="manga__btn manga__btn--flex-none"
                onClick={() => setDrop((prevDrop) => !prevDrop)}
              >
                {drop ? (
                  <img className="manga__icon" src="/arrow-up.svg" alt="" />
                ) : (
                  <img className="manga__icon" src="/arrow-down.svg" alt="" />
                )}
              </button>
            </div>
            {drop && (
              <p
                className="manga__description"
                dangerouslySetInnerHTML={{ __html: aprocess }}
              ></p>
            )}
          </div>
          <div className="manga__read-or-buy">
            <p className="manga__sec-title">Read or Buy</p>
            <div className="manga__links">
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
            </div>
          </div>
          <div className="manga__title-container">
            <p className="manga__sec-title">Alternative Titles</p>
            <div className="manga__lang-container">
              {statics?.data?.data?.attributes?.altTitles?.map((val, idx) => {
                const lang = Object.values(val)[0];
                return (
                  <p className="manga__lang" key={idx}>
                    {lang}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Manga;
