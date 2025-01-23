import ArrowLeft from "../svgs/ArrowLeft";
import ArrowRight from "../svgs/ArrowRight";
import ArrowDown from "../svgs/ArrowDown";
import ArrowTop from "../svgs/ArrowTop";
import PropTypes from "prop-types";

const NavButton = ({ onClick = () => {}, disabled = false, type = "left" }) => {
  const arrowMap = {
    left: <ArrowLeft />,
    right: <ArrowRight />,
    down: <ArrowDown />,
    top: <ArrowTop />,
  };

  const getArrow = (type) => arrowMap[type];

  return (
    <button
      type="button"
      className="controller__nav-btn"
      disabled={disabled}
      onClick={onClick}
    >
      {getArrow(type)}
    </button>
  );
};

NavButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["left", "right", "down", "top"]),
};

export default NavButton;
