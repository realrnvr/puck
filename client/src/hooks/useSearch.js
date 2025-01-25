import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../services/query/query";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", { debouncedQuery }],
    queryFn: () => fetchSearch({ query: debouncedQuery }),
    enabled: !!debouncedQuery,
  });

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleNavigate = useCallback(
    ({ mangaId, authorId }) => {
      navigate(`/manga/${mangaId}/${authorId}`);
    },
    [navigate]
  );

  return {
    query,
    setQuery,
    handleQueryChange,
    data,
    isLoading,
    isError,
    error,
    handleNavigate,
  };
};
