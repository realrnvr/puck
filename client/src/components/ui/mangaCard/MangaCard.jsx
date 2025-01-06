import "./manga-card.css";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/api/axios";
import PropTypes from "prop-types";
import FavBtn from "../favBtn/FavBtn";
import MangaCardSkeleton from "../../../utils/skeletons/MangaCard/MangaCardSkeleton";

const MangaCard = ({ title, mangaId, authorId }) => {
  const { data, isLoading } = useQuery({
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
              <img
                className="manga-card__img"
                src={`${coverUrl}`}
                alt="manga"
              />
              <figcaption className="manga-card__title">{title}</figcaption>
            </figure>
          </Link>
        </div>
      ) : (
        <MangaCardSkeleton />
      )}
    </>
  );
};

MangaCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  mangaId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
};

export default memo(MangaCard);
