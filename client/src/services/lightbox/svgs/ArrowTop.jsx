import PropTypes from "prop-types";

const ArrowTop = () => {
  return (
    <svg
      className="controller__nav-svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M3 19h18a1.002 1.002 0 00.823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 003 19zm9-12.243L19.092 17H4.908L12 6.757z" />
    </svg>
  );
};

ArrowTop.propTypes = {
  className: PropTypes.string,
};

export default ArrowTop;
