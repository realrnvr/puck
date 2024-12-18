import { Link } from "react-router-dom";
import "./manga-card.css";
import PropTypes from "prop-types";

const MangaCard = ({ img, title, mangaId, authorId }) => {
  return (
    <Link to={`/manga/${mangaId}/${authorId}`}>
      <figure className="manga-card">
        <img className="manga-card__img" src={`/${img}.jpg`} alt="manga" />
        <figcaption className="manga-card__title">{title}</figcaption>
      </figure>
    </Link>
  );
};

MangaCard.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mangaId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
};

export default MangaCard;
