import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const FavouriteBtn = ({ onClick = () => {}, prefetch = () => {} }) => {
  return (
    <li>
      <Link
        to="/favourite"
        onClick={onClick}
        onMouseEnter={prefetch}
        onTouchStart={prefetch}
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="header__icon header__icon--width"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <span className="visually-hidden">My Favorites</span>
      </Link>
    </li>
  );
};

FavouriteBtn.propTypes = {
  onClick: PropTypes.func,
  prefetch: PropTypes.func,
};

export default FavouriteBtn;
