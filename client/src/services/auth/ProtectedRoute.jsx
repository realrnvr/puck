import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
