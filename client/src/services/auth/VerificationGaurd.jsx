import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const VerificationGaurd = ({ value, children }) => {
  const parameter = localStorage.getItem(value);

  if (!parameter) {
    return (
      <Navigate to={value === "sign-mail" ? "/login" : "/forgot-password"} />
    );
  }

  return children;
};

VerificationGaurd.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default VerificationGaurd;
