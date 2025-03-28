import PropTypes from "prop-types";

const ArrowRight = () => {
  return (
    <svg
      className="controller__nav-svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M5.536 21.886a1.004 1.004 0 001.033-.064l13-9a1 1 0 000-1.644l-13-9A.998.998 0 005 3v18a1 1 0 00.536.886zM7 4.909L17.243 12 7 19.091V4.909z" />
    </svg>
  );
};

ArrowRight.propTypes = {
  className: PropTypes.string,
};

export default ArrowRight;
