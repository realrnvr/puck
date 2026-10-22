import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Read from "./Read";
import { AuthContext } from "../../hooks/useAuth";
import { fetchMangaCover, fetchRandomManga } from "../../services/query/query";
import { expectNoSeriousA11yViolations } from "../../test/a11y";

vi.mock("../../services/query/query", () => ({
  fetchRandomManga: vi.fn(),
  fetchMangaCover: vi.fn(),
  fetchMangas: vi.fn(),
  fetchFavourite: vi.fn(),
}));

const manga = [
  { mangaId: "manga-1", title: "Berserk", authorId: "author-1" },
  { mangaId: "manga-2", title: "Vagabond", authorId: "author-2" },
];

const renderRead = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ token: null }}>
        <MemoryRouter>
          <Read />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
};

describe("Read", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMangaCover.mockResolvedValue({
      data: { coverImgUrl: "/cover.webp" },
    });
  });

  it("waits for the random manga response before prefetching covers", async () => {
    let resolveRandomManga;
    fetchRandomManga.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRandomManga = resolve;
        }),
    );

    const { container } = renderRead();

    expect(screen.queryByText("Berserk")).not.toBeInTheDocument();

    await act(async () => {
      resolveRandomManga({ data: { manga } });
    });

    expect(await screen.findByText("Berserk")).toBeInTheDocument();
    expect(screen.getByText("Vagabond")).toBeInTheDocument();
    await expectNoSeriousA11yViolations(container);

    await waitFor(() => {
      expect(fetchMangaCover).toHaveBeenCalledWith({
        mangaId: "manga-1",
        volume: "desc",
        width: 256,
      });
      expect(fetchMangaCover).toHaveBeenCalledWith({
        mangaId: "manga-2",
        volume: "desc",
        width: 256,
      });
    });
  });
});
