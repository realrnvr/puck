import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";
import Loader from "../../components/ui/loader/Loader";

const AuthRedirectGaurd = ({ children }) => {
  const { token, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="redirect">
        <Loader />;
      </div>
    );
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

AuthRedirectGaurd.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRedirectGaurd;
