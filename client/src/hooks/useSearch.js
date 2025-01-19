import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const navigate = useNavigate();

  const fetchManga = (query) => {
    return axiosInstance.get(`/api/v1/manga/search?query=${query}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search", { debouncedQuery }],
    queryFn: () => fetchManga(debouncedQuery),
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
    handleNavigate,
  };
};
