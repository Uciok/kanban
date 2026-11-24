import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "./Board";

function setup() {
  render(<Board />);
  return userEvent.setup();
}

describe("Board", () => {
  it("renders five columns with seed cards", () => {
    setup();
    expect(screen.getAllByRole("region")).toHaveLength(5);
    expect(screen.getAllByTestId("card")).toHaveLength(10);
    expect(screen.getByText("Design pricing page")).toBeInTheDocument();
  });

  it("renames a column", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Backlog" }));
    const input = screen.getByLabelText("Column name");
    await user.clear(input);
    await user.type(input, "Ideas{Enter}");
    expect(screen.getByRole("region", { name: "Ideas" })).toBeInTheDocument();
  });

  it("cancels a rename with Escape", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Done" }));
    await user.type(screen.getByLabelText("Column name"), "xyz{Escape}");
    expect(screen.getByRole("region", { name: "Done" })).toBeInTheDocument();
  });

  it("adds a card", async () => {
    const user = setup();
    const column = screen.getByRole("region", { name: "Review" });
    await user.click(within(column).getByRole("button", { name: /add card/i }));
    await user.type(within(column).getByLabelText("Card title"), "New task");
    await user.type(within(column).getByLabelText("Card details"), "Some details");
    await user.click(within(column).getByRole("button", { name: "Add card" }));
    expect(within(column).getByText("New task")).toBeInTheDocument();
    expect(within(column).getByText("Some details")).toBeInTheDocument();
    expect(within(column).getAllByTestId("card")).toHaveLength(2);
  });

  it("does not add a card without a title", async () => {
    const user = setup();
    const column = screen.getByRole("region", { name: "Review" });
    await user.click(within(column).getByRole("button", { name: /add card/i }));
    expect(within(column).getByRole("button", { name: "Add card" })).toBeDisabled();
  });

  it("deletes a card", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Delete Kickoff meeting" }));
    expect(screen.queryByText("Kickoff meeting")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("card")).toHaveLength(9);
  });
});
