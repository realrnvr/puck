import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";

const AuthRedirectGaurd = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

AuthRedirectGaurd.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRedirectGaurd;
