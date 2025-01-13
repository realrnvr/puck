import { useState } from "react";
import { axiosInstance } from "../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@uidotdev/usehooks";
import Skeleton from "react-loading-skeleton";

const Search = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const navigate = useNavigate();

  const fetchManga = (query) => {
    return axiosInstance.get(`/api/v1/manga/search?query=${query}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search", { debouncedQuery }],
    queryFn: () => fetchManga(debouncedQuery),
    enabled: Boolean(debouncedQuery),
  });

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleNavigate = ({ mangaId, authorId }) => {
    navigate(`/manga/${mangaId}/${authorId}`);
  };

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
          <button type="button" className="header__btn header__search-btn">
            <svg
              viewBox="0 0 16 16"
              className="header__icon header__icon--width header__icon--color"
            >
              <path
                d="M6.38 0A6.3 6.3 0 000 6.23a6.3 6.3 0 006.38 6.24c1.26 0 2.43-.36 3.41-.97L14.4 16l1.6-1.56-4.55-4.43a6.1 6.1 0 001.31-3.78A6.3 6.3 0 006.38 0zm0 1.47c2.7 0 4.88 2.12 4.88 4.76A4.82 4.82 0 016.38 11 4.82 4.82 0 011.5 6.23a4.82 4.82 0 014.88-4.76z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </form>
        <ul className="search__result">
          {data?.data?.manga?.map((manga) => (
            <li
              key={manga.mangaId}
              className="search__item"
              onClick={() =>
                handleNavigate({
                  mangaId: manga?.mangaId,
                  authorId: manga?.authorId,
                })
              }
            >
              {manga?.title}
            </li>
          ))}
          {isLoading ? (
            <Skeleton
              baseColor="#202020"
              highlightColor="#444"
              height={"25px"}
              width={"100%"}
              className="search__Skeleton"
              count={4}
            />
          ) : null}
          {query && !isLoading && !data?.data?.manga?.length ? (
            <p>No results found.</p>
          ) : null}
        </ul>
      </div>
    </>
  );
};

export default Search;
