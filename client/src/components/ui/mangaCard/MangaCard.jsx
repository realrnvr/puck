import "./manga-card.css";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/api/axios";
import { useNavigate } from "react-router-dom";
import FavBtn from "../favBtn/FavBtn";
import PropTypes from "prop-types";
import MangaCardImgSkeleton from "../../../utils/skeletons/mangaCardImg/MangaCardImgSkeleton";

const MangaCard = ({ title, mangaId, authorId }) => {
  const navigate = useNavigate();

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

  const handleMangaClick = () => {
    navigate(`/manga/${mangaId}/${authorId}`);
  };

  return (
    <div className="manga-card" onClick={handleMangaClick}>
      <img className="manga-card__hold-img" src="/t-1px.webp" alt="" />
      <div className="manga-card__fav-btn-wrapper">
        <FavBtn
          mangaId={mangaId}
          mangaData={mangaData}
          className="manga-card__fav-btn"
        />
      </div>
      <div className="manga-card__content">
        {isLoading ? (
          <MangaCardImgSkeleton />
        ) : (
          <img
            className="manga-card__img"
            src={isError ? "/1px.webp" : `${coverUrl}`}
            alt="manga"
          />
        )}
        <p className="manga-card__title">{title || "---"} </p>
      </div>
    </div>
  );
};

MangaCard.propTypes = {
  title: PropTypes.string,
  mangaId: PropTypes.string,
  authorId: PropTypes.string,
};

export default MangaCard;
