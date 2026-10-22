import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoSeriousA11yViolations } from "../../../test/a11y";
import Input from "./Input";

const renderInput = () =>
  render(
    <Input
      register={() => ({
        name: "password",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      })}
      errors={{}}
      watch={() => ""}
      formData={{
        name: "password",
        label: "Password",
        defaultMsg: "Use at least 8 characters.",
        toggle: true,
        type: "password",
      }}
    />,
  );

describe("Input", () => {
  it("labels the password toggle and switches input type", async () => {
    const user = userEvent.setup();
    const { container } = renderInput();

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toBeInTheDocument();

    await expectNoSeriousA11yViolations(container);
  });
});
