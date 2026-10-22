import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../hooks/useAuth";
import { fetchMangaCover } from "../../../services/query/query";
import { expectNoSeriousA11yViolations } from "../../../test/a11y";
import MangaCard from "./MangaCard";

vi.mock("../../../services/query/query", () => ({
  fetchMangaCover: vi.fn(),
}));

const renderCard = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ token: null }}>
        <MemoryRouter>
          <MangaCard title="Berserk" mangaId="manga-1" authorId="author-1" />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
};

describe("MangaCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMangaCover.mockResolvedValue({
      data: { coverImgUrl: "/cover.webp" },
    });
  });

  it("exposes the card as a keyboard-focusable link", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    const link = await screen.findByRole("link", { name: "View Berserk" });

    expect(link).toHaveAttribute("href", "/manga/manga-1/author-1");
    expect(
      screen.getByRole("button", { name: "Add to favourites" }),
    ).toBeInTheDocument();

    await user.tab();
    expect(link).toHaveFocus();

    await expectNoSeriousA11yViolations(container);
  });
});
