import "./manga-card.css";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchMangaCover } from "../../../services/query/query";
import FavBtn from "../favBtn/FavBtn";
import PropTypes from "prop-types";
import MangaCardImgSkeleton from "../../../utils/skeletons/mangaCardImg/MangaCardImgSkeleton";

const MangaCard = ({ title, mangaId, authorId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga-cover", { mangaId, volume: "desc", width: 256 }],
    queryFn: () => fetchMangaCover({ mangaId, volume: "desc", width: 256 }),
  });

  const coverUrl = data?.data?.coverImgUrl;

  const mangaData = {
    mangaTitle: title,
    mangaId: mangaId,
    authorId: authorId,
    coverUrl: coverUrl,
  };

  const imageSrc = isError || !coverUrl ? "/1px.webp" : coverUrl;

  return (
    <div className="manga-card">
      <Link
        to={`/manga/${mangaId}/${authorId}`}
        className="manga-card__link"
        aria-label={title ? `View ${title}` : "View manga"}
      >
        <img
          className="manga-card__hold-img"
          src="/t-1px.webp"
          alt=""
          width={250}
          height={275}
        />
        <div className="manga-card__content">
          {isLoading ? (
            <MangaCardImgSkeleton />
          ) : (
            <img
              className="manga-card__img"
              src={imageSrc}
              alt=""
              width={250}
              height={275}
            />
          )}
          <p className="manga-card__title">{title || "---"} </p>
        </div>
      </Link>
      <div className="manga-card__fav-btn-wrapper">
        <FavBtn
          mangaId={mangaId}
          mangaData={mangaData}
          className="manga-card__fav-btn"
        />
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
