import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";
import { loginAuthOne } from "../../../services/mutation/authMutation";
import { expectNoSeriousA11yViolations } from "../../../test/a11y";

vi.mock("../../../services/mutation/authMutation", () => ({
  loginAuthOne: vi.fn(),
}));

const renderLogin = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("has no serious accessibility violations", async () => {
    const { container } = renderLogin();

    await expectNoSeriousA11yViolations(container);
  });

  it("shows the Google-account message instead of navigating", async () => {
    loginAuthOne.mockRejectedValue({
      response: {
        data: {
          type: "google-account",
          message:
            "This account uses Google sign-in. Continue with Google or reset your password via email.",
        },
      },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(/This account uses Google sign-in/i),
    ).toBeInTheDocument();
  });
});
