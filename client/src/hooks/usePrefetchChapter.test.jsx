import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePrefetchChapter } from "./usePrefetchChapter";
import { fetchChapter, fetchChapterImage } from "../services/query/query";

vi.mock("../services/query/query", () => ({
  fetchChapter: vi.fn(),
  fetchChapterImage: vi.fn(),
}));

const createWrapper = (queryClient) => {
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "QueryClientWrapper";
  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
};

const renderPrefetch = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(
    () => usePrefetchChapter({ mangaId: "manga-1", CHUNK_SIZE: 10 }),
    { wrapper: createWrapper(queryClient) },
  );
};

describe("usePrefetchChapter", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    fetchChapter.mockResolvedValue({
      data: { data: [{ id: "chapter-1" }, { id: "chapter-2" }] },
    });
    fetchChapterImage.mockResolvedValue({ data: {} });
  });

  it("falls back to defaults when local storage is malformed", async () => {
    localStorage.setItem("mangaState:manga-1", "{not-json");

    const { result } = renderPrefetch();

    await act(async () => {
      await result.current.prefetch();
    });

    expect(fetchChapter).toHaveBeenCalledWith({
      mangaId: "manga-1",
      CHUNK_SIZE: 10,
      offset: 0,
    });
    await waitFor(() => {
      expect(fetchChapterImage).toHaveBeenCalledWith({
        chapterId: "chapter-1",
        quality: "data",
      });
    });
  });

  it("uses valid stored chapter state", async () => {
    localStorage.setItem(
      "mangaState:manga-1",
      JSON.stringify({ chapterCount: 1, quality: "data-saver", offset: 5 }),
    );

    const { result } = renderPrefetch();

    await act(async () => {
      await result.current.prefetch();
    });

    expect(fetchChapter).toHaveBeenCalledWith({
      mangaId: "manga-1",
      CHUNK_SIZE: 10,
      offset: 5,
    });
    await waitFor(() => {
      expect(fetchChapterImage).toHaveBeenCalledWith({
        chapterId: "chapter-2",
        quality: "data-saver",
      });
    });
  });
});
