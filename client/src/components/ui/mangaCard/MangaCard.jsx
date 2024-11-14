import "./manga-card.css";
import PropTypes from "prop-types";

const MangaCard = ({ img, title }) => {
  return (
    <figure className="manga-card">
      <img className="manga-card__img" src={`/${img}.jpg`} alt="manga" />
      <figcaption className="manga-card__title">{title}</figcaption>
    </figure>
  );
};

MangaCard.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default MangaCard;
