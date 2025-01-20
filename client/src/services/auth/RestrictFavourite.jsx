import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";

const RestrictFavourite = ({ children }) => {
  const auth = useAuth();

  if (!auth.token) {
    return <Navigate to={"/signup"} replace />;
  }

  return children;
};

RestrictFavourite.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RestrictFavourite;
