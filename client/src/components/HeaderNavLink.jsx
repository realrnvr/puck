import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const HeaderNavLink = ({
  value,
  onClick = () => {},
  onMouseEnter = () => {},
  onTouchStart = () => {},
}) => {
  return (
    <li>
      <NavLink
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
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
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onTouchStart: PropTypes.func,
};

export default HeaderNavLink;
