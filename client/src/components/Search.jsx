import { useSearch } from "../hooks/useSearch";
import Skeleton from "react-loading-skeleton";
import PropTypes from "prop-types";

const Search = ({ onClick }) => {
  const {
    query,
    setQuery,
    handleQueryChange,
    data,
    isLoading,
    isError,
    error,
    handleNavigate,
  } = useSearch();

  return (
    <>
      <div className="header__form-wrapper">
        <form className="header__form" aria-label="Search Manga">
          <input
            type="text"
            name="search"
            className="header__input"
            spellCheck="false"
            autoComplete="off"
            placeholder="Search"
            value={query}
            onChange={handleQueryChange}
          />
          <p className="header__search-btn">
            <svg
              viewBox="0 0 16 16"
              className="header__icon header__icon--width header__icon--color"
            >
              <path
                d="M6.38 0A6.3 6.3 0 000 6.23a6.3 6.3 0 006.38 6.24c1.26 0 2.43-.36 3.41-.97L14.4 16l1.6-1.56-4.55-4.43a6.1 6.1 0 001.31-3.78A6.3 6.3 0 006.38 0zm0 1.47c2.7 0 4.88 2.12 4.88 4.76A4.82 4.82 0 016.38 11 4.82 4.82 0 011.5 6.23a4.82 4.82 0 014.88-4.76z"
                fill="currentColor"
              ></path>
            </svg>
          </p>
        </form>
        {
          <ul
            className={`search__result ${
              !data?.data?.manga?.length && !isLoading
                ? "search__result--pd"
                : null
            }`}
          >
            {data?.data?.manga?.map((manga) => (
              <li
                key={manga.mangaId}
                className="search__item"
                onClick={() => {
                  onClick?.();
                  handleNavigate({
                    mangaId: manga?.mangaId,
                    authorId: manga?.authorId,
                  });
                  setQuery("");
                }}
              >
                {manga?.title}
              </li>
            ))}
            {isLoading && !isError ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"25px"}
                width={"100%"}
                className="search__Skeleton"
                count={4}
              />
            ) : null}
          </ul>
        }
        {(query && !isLoading && data?.data?.manga?.length === 0) || isError ? (
          <p className="header__no-search">
            {isError
              ? error?.response?.data?.message || "Something went wrong."
              : "No results found."}
          </p>
        ) : null}
      </div>
    </>
  );
};

Search.propTypes = {
  onClick: PropTypes.func,
};

export default Search;
