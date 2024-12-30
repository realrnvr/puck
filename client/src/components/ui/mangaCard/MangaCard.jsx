import "./manga-card.css";
import { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const MangaCard = ({ img = "/1px.webp", title, mangaId, authorId }) => {
  return (
    <Link to={`/manga/${mangaId}/${authorId}`} className="manga-card__wrapper">
      <figure className="manga-card">
        <img className="manga-card__img" src={`${img}`} alt="manga" />
        <figcaption className="manga-card__title">{title}</figcaption>
      </figure>
    </Link>
  );
};

MangaCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  mangaId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
};

export default memo(MangaCard);
