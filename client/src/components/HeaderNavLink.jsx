import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const HeaderNavLink = ({ value }) => {
  return (
    <li>
      <NavLink
        style={({ isActive }) =>
          isActive
            ? {
                color: "orange",
              }
            : null
        }
        className="header__pri-link"
        to={`/${value}`}
      >
        {value}
      </NavLink>
    </li>
  );
};

HeaderNavLink.propTypes = {
  value: PropTypes.string,
};

export default HeaderNavLink;
