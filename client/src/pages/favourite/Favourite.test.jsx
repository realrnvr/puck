import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { delay, http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Favourite from "./Favourite";
import { server } from "../../test/msw/server";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ token: "test-token" }),
}));

const favouritesUrl = /\/api\/v1\/client\/all-favourites/;
const coverUrl = /\/api\/v1\/manga\/cover\/[^/]+/;
const favouriteUrl = /\/api\/v1\/client\/favourite\/[^/]+/;

const manga = (suffix) => ({
  mangaId: `manga-${suffix}`,
  mangaTitle: `Manga ${suffix}`,
  authorId: `author-${suffix}`,
});

const coverHandler = http.get(coverUrl, () =>
  HttpResponse.json({ coverImgUrl: "/cover.webp" }),
);

const favouriteHandler = http.get(favouriteUrl, () =>
  HttpResponse.json({ isFavourite: true }),
);

const favouritesHandler = (pages) =>
  http.get(favouritesUrl, ({ request }) => {
    const cursor = new URL(request.url).searchParams.get("cursor") ?? "";

    return HttpResponse.json(
      pages[cursor] ?? { client: [], nextCursor: null, length: 0 },
    );
  });

const renderFavourite = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Favourite />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("Favourite", () => {
  beforeEach(() => {
    server.use(coverHandler, favouriteHandler);
  });

  it("shows skeletons while the first page is loading", async () => {
    server.use(
      http.get(favouritesUrl, async () => {
        await delay(50);
        return HttpResponse.json({
          client: [manga(1)],
          nextCursor: null,
          length: 1,
        });
      }),
    );

    renderFavourite();

    expect(
      document.querySelectorAll(".manga-card__skeleton-container").length,
    ).toBeGreaterThan(0);

    expect(await screen.findByText("Manga 1")).toBeInTheDocument();
  });

  it("shows the empty state when there are no favourites", async () => {
    server.use(
      favouritesHandler({
        "": { client: [], nextCursor: null, length: 0 },
      }),
    );

    renderFavourite();

    expect(
      await screen.findByText("Your favourite list is empty!"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" }),
    ).not.toBeInTheDocument();
  });

  it("shows the error state when the request fails", async () => {
    server.use(
      http.get(favouritesUrl, () =>
        HttpResponse.json({ message: "Boom" }, { status: 500 }),
      ),
    );

    renderFavourite();

    expect(await screen.findByText("Boom")).toBeInTheDocument();
    expect(screen.getByText(/ERROR/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" }),
    ).not.toBeInTheDocument();
  });

  it("loads the next page and reports when there is nothing more", async () => {
    const user = userEvent.setup();
    server.use(
      favouritesHandler({
        "": {
          client: [manga(1), manga(2)],
          nextCursor: "cursor-2",
          length: 2,
        },
        "cursor-2": {
          client: [manga(3)],
          nextCursor: null,
          length: 1,
        },
      }),
    );

    renderFavourite();

    expect(await screen.findByText("Manga 1")).toBeInTheDocument();
    expect(screen.getByText("Manga 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Load More" }));

    expect(await screen.findByText("Manga 3")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Nothing more to load" }),
      ).toBeInTheDocument();
    });
  });
});
