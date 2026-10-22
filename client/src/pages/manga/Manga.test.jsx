import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../hooks/useAuth";
import { useMangaData } from "../../hooks/useMangaData";
import { usePrefetchChapter } from "../../hooks/usePrefetchChapter";
import { expectNoSeriousA11yViolations } from "../../test/a11y";
import Manga from "./Manga";

vi.mock("../../hooks/useMangaData", () => ({
  useMangaData: vi.fn(),
}));

vi.mock("../../hooks/usePrefetchChapter", () => ({
  usePrefetchChapter: vi.fn(),
}));

const mangaData = {
  mangaTitle: "Berserk",
  mangaId: "manga-1",
  authorId: "author-1",
  coverUrl: "/cover.webp",
};

const baseMangaData = {
  statics: {
    data: {
      data: {
        attributes: {
          title: { en: "Berserk" },
          altTitleJa: "ベルセルク",
          year: 1989,
          status: "ongoing",
          publicationDemographic: "seinen",
          contentRating: "suggestive",
          tags: [
            { attributes: { name: { en: "Action" } } },
            { attributes: { name: { en: "Horror" } } },
          ],
          links: {
            raw: "https://raw.example",
            engtl: "https://english.example",
            amz: "https://amazon.example",
            ebj: "https://ebookjapan.example",
            cdj: "https://cdjapan.example",
          },
          altTitles: ["Berserk", "Berserk Alternative"],
        },
      },
    },
  },
  isStatics: false,
  isStaticsError: false,
  staticsError: null,
  authorData: {
    data: { data: { attributes: { name: "Kentaro Miura" } } },
  },
  isAuthor: false,
  isAuthorError: false,
  authorError: null,
  coverImg: { data: { coverImgUrl: "/cover.webp" } },
  isCover: false,
  isCoverError: false,
  manga: "A dark fantasy about Guts.",
  author: "Kentaro Miura biography.",
  mangaData,
};

const renderManga = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(
    [
      {
        path: "/manga/:mangaId/:authorId",
        element: <Manga />,
        loader: () => ({ mangaId: "manga-1", authorId: "author-1" }),
      },
    ],
    { initialEntries: ["/manga/manga-1/author-1"] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ token: null }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
};

describe("Manga", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePrefetchChapter.mockReturnValue({ prefetch: vi.fn() });
    useMangaData.mockReturnValue(baseMangaData);
  });

  it("renders the shaped manga details", async () => {
    const { container } = renderManga();

    expect(
      await screen.findByRole("heading", { name: "Berserk" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Created by Kentaro Miura")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Horror")).toBeInTheDocument();
    expect(screen.getByText("Publication: 1989, ongoing")).toBeInTheDocument();
    expect(screen.getByText("A dark fantasy about Guts.")).toBeInTheDocument();
    expect(screen.getByText("Berserk Alternative")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Official Raw" })).toHaveAttribute(
      "href",
      "https://raw.example",
    );
    expect(screen.getByRole("button", { name: "Read" })).toBeEnabled();
    expect(usePrefetchChapter).toHaveBeenCalledWith({
      mangaId: "manga-1",
      CHUNK_SIZE: 100,
    });
    await expectNoSeriousA11yViolations(container);
  });

  it("disables reading when MangaDex returns an API error", async () => {
    useMangaData.mockReturnValue({
      ...baseMangaData,
      statics: undefined,
      isStatics: false,
      isStaticsError: true,
      staticsError: { response: { data: { type: "dex-api-error" } } },
    });

    renderManga();

    expect(await screen.findByRole("button", { name: "Read" })).toBeDisabled();
  });
});
