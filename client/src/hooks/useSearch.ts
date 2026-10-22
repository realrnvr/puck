import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../services/query/query";

interface SearchTarget {
  mangaId: string;
  authorId: string;
}

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", { debouncedQuery }],
    queryFn: () => fetchSearch({ query: debouncedQuery }),
    enabled: !!debouncedQuery.trim(),
  });

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (query === "" && value.startsWith(" ")) return;
      setQuery(value);
    },
    [query],
  );

  const handleNavigate = useCallback(
    ({ mangaId, authorId }: SearchTarget) => {
      navigate(`/manga/${mangaId}/${authorId}`);
    },
    [navigate],
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
