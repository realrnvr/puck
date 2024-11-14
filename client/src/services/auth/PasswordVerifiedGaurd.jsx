import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PasswordVerifiedGaurd = ({ children }) => {
  const parameter = localStorage.getItem("pass-mail");

  if (!parameter) {
    return <Navigate to="/login/loginTwo" />;
  }
  return children;
};

PasswordVerifiedGaurd.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PasswordVerifiedGaurd;
