import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
