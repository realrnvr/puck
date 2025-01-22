import "./error-comp.css";
import PropTypes from "prop-types";

const ErrorComp = ({
  width = "100%",
  height = "100%",
  className,
  count = 1,
}) => {
  return Array.from({ length: count }, (_, idx) => {
    return (
      <div
        key={idx}
        className={`${className} error-comp`}
        style={{ width, height }}
      ></div>
    );
  });
};

ErrorComp.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  count: PropTypes.number,
};

export default ErrorComp;
