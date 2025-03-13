import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePrefetchFavourite } from "../hooks/usePrefetchFavourite";
import Skeleton from "react-loading-skeleton";
import PropTypes from "prop-types";
import FavouriteBtn from "./FavouriteBtn";

const LIMIT = Number(import.meta.env.VITE_ALL_FAVOURITE_LIMIT) || 6;

const HeaderUtilities = ({ onClick }) => {
  const { token, logout, mutateTokenPending, mutateLogoutPending } = useAuth();

  const { prefetch } = usePrefetchFavourite(LIMIT);

  return (
    <ul className="header__utilities">
      {token ? (
        mutateLogoutPending ? (
          <Skeleton
            baseColor="#202020"
            highlightColor="#444"
            height={"34px"}
            width={"170px"}
          />
        ) : (
          <>
            <li>
              <Link to="/account" className="header__nav-btn" onClick={onClick}>
                Account
              </Link>
            </li>
            <li>
              <button className="header__log-out-btn" onClick={logout}>
                Log out
              </button>
            </li>
            <FavouriteBtn onClick={onClick} prefetch={prefetch} />
          </>
        )
      ) : mutateTokenPending ? (
        <Skeleton
          baseColor="#202020"
          highlightColor="#444"
          height={"30px"}
          width={"170px"}
        />
      ) : (
        <>
          <li>
            <Link className="header__nav-btn" to="/login">
              Log in
            </Link>
          </li>
          <li>
            <Link className="header__nav-btn" to="/signup">
              Sign up
            </Link>
          </li>
          <FavouriteBtn onClick={onClick} prefetch={prefetch} />
        </>
      )}
    </ul>
  );
};

HeaderUtilities.propTypes = {
  onClick: PropTypes.func,
};

export default HeaderUtilities;
