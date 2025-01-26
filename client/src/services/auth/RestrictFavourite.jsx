import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from "prop-types";
import FavouriteSkeleton from "../../utils/skeletons/favourite/FavouriteSkeleton";

const RestrictFavourite = ({ children }) => {
  const auth = useAuth();

  if (auth.mutateTokenPending) {
    return <FavouriteSkeleton />;
  }

  if (!auth.token) {
    return <Navigate to={"/signup"} replace />;
  }

  return children;
};

RestrictFavourite.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RestrictFavourite;
