import { useState } from "react";
import { axiosInstance } from "../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");

  const fetchManga = (query) => {
    return axiosInstance.get(`/api/v1/manga/search?query=${query}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search", { query }],
    queryFn: () => fetchManga(query),
    enabled: !!query,
  });

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <form className="header__form" aria-label="Search Manga and Anime">
        <input
          type="text"
          name="search"
          className="header__input"
          placeholder="Search"
          value={query}
          onChange={handleQueryChange}
        />
        <button
          type="submit"
          className="header__btn header__search-btn"
          aria-label="Submit"
        >
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
      <div>
        {isLoading && <div>loading...</div>}
        <ul className="search-results">
          {data?.data?.manga?.map((manga) => (
            <li key={manga.mangaId} className="search-item">
              <Link to={`/manga/${manga?.mangaId}/${manga?.authorId}`}>
                {manga?.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Search;
