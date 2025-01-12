import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const HeaderGoto = ({ title, mangaId, authorId }) => {
  return (
    <li>
      <Link className="header__sec-link" to={`/manga/${mangaId}/${authorId}`}>
        {title}
      </Link>
    </li>
  );
};

HeaderGoto.propTypes = {
  title: PropTypes.string,
  mangaId: PropTypes.string,
  authorId: PropTypes.string,
};

export default HeaderGoto;
