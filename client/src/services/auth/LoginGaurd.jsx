import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const LoginGaurd = ({ children }) => {
  const parameter = localStorage.getItem("log-mail");

  if (!parameter) {
    return <Navigate to="/login" />;
  }

  return children;
};

LoginGaurd.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginGaurd;
