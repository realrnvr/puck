import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";
import Loader from "../../components/ui/loader/Loader";

const AuthRedirectGuard = ({ children }) => {
  const { token, mutateTokenPending } = useAuth();

  if (mutateTokenPending) {
    return (
      <div className="redirect">
        <Loader />
      </div>
    );
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

AuthRedirectGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRedirectGuard;
