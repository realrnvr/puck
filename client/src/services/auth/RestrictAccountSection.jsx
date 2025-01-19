import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";

const RestrictAccountSection = ({ children, to = "/login" }) => {
  const auth = useAuth();

  if (auth.token === null) {
    return <Navigate to={to} replace />;
  }

  return children;
};

RestrictAccountSection.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
};

export default RestrictAccountSection;
