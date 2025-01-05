import "./manga-card.css";
import { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import FavBtn from "../favBtn/FavBtn";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MangaCard = ({
  img = "/t-1px.webp",
  title,
  mangaId,
  authorId,
  isLoading,
}) => {
  const mangaData = {
    mangaTitle: title,
    mangaId: mangaId,
    authorId: authorId,
    coverUrl: img,
  };

  return (
    <>
      {!isLoading ? (
        <div className="manga-card__container">
          <FavBtn
            mangaId={mangaId}
            mangaData={mangaData}
            className={"manga-card__btn"}
          />
          <Link
            to={`/manga/${mangaId}/${authorId}`}
            className="manga-card__wrapper"
          >
            <figure className="manga-card">
              <img className="manga-card__img" src={`${img}`} alt="manga" />
              <figcaption className="manga-card__title">{title}</figcaption>
            </figure>
          </Link>
        </div>
      ) : (
        <div className="manga-card__skeleton-container">
          <div className="manga-card__skeleton-btn">
            <Skeleton
              height={"100%"}
              baseColor="#202020"
              highlightColor="#444"
            />
          </div>
          <figure className="manga-card__skeleton">
            <div className="manga-card__skeleton-img">
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
            <div className="manga-card__caption">
              <h2 className="manga-card__title">
                <Skeleton
                  className="manga-card__title-skeleton"
                  baseColor="#202020"
                  highlightColor="#444"
                  direction="rtl"
                />
              </h2>
            </div>
          </figure>
        </div>
      )}
    </>
  );
};

MangaCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  mangaId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(MangaCard);
