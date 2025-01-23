import "./manga-card.css";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/api/axios";
import MangaCardImgSkeleton from "../../../utils/skeletons/mangaCardImg/MangaCardImgSkeleton";
import PropTypes from "prop-types";
import FavBtn from "../favBtn/FavBtn";

const MangaCard = ({ title, mangaId, authorId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga-cover", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
  });

  const coverUrl = data?.data?.coverImgUrl;

  const mangaData = {
    mangaTitle: title,
    mangaId: mangaId,
    authorId: authorId,
    coverUrl: coverUrl,
  };

  return (
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
          {isLoading ? (
            <MangaCardImgSkeleton />
          ) : (
            <img
              className="manga-card__img"
              src={isError ? "/1px.webp" : `${coverUrl}`}
              alt="manga"
            />
          )}
          <figcaption className="manga-card__title">{title}</figcaption>
        </figure>
      </Link>
    </div>
  );
};

MangaCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string,
  mangaId: PropTypes.string,
  authorId: PropTypes.string,
};

export default memo(MangaCard);
