import PropTypes from "prop-types";

const ArrowDown = () => {
  return (
    <svg
      className="controller__nav-svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M21.886 5.536A1.002 1.002 0 0021 5H3a1.002 1.002 0 00-.822 1.569l9 13a.998.998 0 001.644 0l9-13a.998.998 0 00.064-1.033zM12 17.243L4.908 7h14.184L12 17.243z" />
    </svg>
  );
};

ArrowDown.propTypes = {
  className: PropTypes.string,
};

export default ArrowDown;
