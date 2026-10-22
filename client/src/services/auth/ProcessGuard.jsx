import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProcessGuard = ({ children, value, to }) => {
  const parameter = localStorage.getItem(value);

  if (!parameter) {
    return <Navigate to={to} />;
  }

  return children;
};

ProcessGuard.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  to: PropTypes.string,
};

export default ProcessGuard;
