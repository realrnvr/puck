import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSearch } from "../hooks/useSearch";
import { expectNoSeriousA11yViolations } from "../test/a11y";
import Search from "./Search";

vi.mock("../hooks/useSearch", () => ({
  useSearch: vi.fn(),
}));

describe("Search", () => {
  const setQuery = vi.fn();
  const handleNavigate = vi.fn();
  const onClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useSearch.mockReturnValue({
      query: "Berserk",
      setQuery,
      handleQueryChange: vi.fn(),
      data: {
        data: {
          manga: [
            { mangaId: "manga-1", authorId: "author-1", title: "Berserk" },
          ],
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      handleNavigate,
    });
  });

  it("supports keyboard selection of results", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <Search onClick={onClick} />
      </MemoryRouter>,
    );

    const input = screen.getByRole("textbox", { name: "Search manga" });
    const result = screen.getByRole("button", { name: "Berserk" });

    await user.tab();
    expect(input).toHaveFocus();

    await user.tab();
    expect(result).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(handleNavigate).toHaveBeenCalledWith({
      mangaId: "manga-1",
      authorId: "author-1",
    });
    expect(setQuery).toHaveBeenCalledWith("");

    await expectNoSeriousA11yViolations(container);
  });
});
