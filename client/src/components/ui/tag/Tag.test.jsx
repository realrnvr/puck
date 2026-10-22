import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tag from "./Tag";

describe("Tag", () => {
  it("renders the provided label", () => {
    render(<Tag tag="Action" />);

    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders a placeholder when no label is provided", () => {
    render(<Tag />);

    expect(screen.getByText("-----")).toBeInTheDocument();
  });
});
